import { useAuth0 } from '@auth0/auth0-react';
import {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

import { useTranslation } from 'next-i18next';

import { getEndpoint } from '@/utils/app/api';
import { title } from '@/utils/app/const';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { throttle } from '@/utils/data/throttle';

import { ChatBody, Conversation, Message } from '@/types/chat';
import { Plugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import LoginButton from '../LoginButton';
import LogoutButton from '../LogoutButton';
import Spinner from '../Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { MemoizedChatMessage } from './MemoizedChatMessage';

export const Chat = memo(() => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const { t } = useTranslation('chat');

  const {
    state: {
      selectedConversation,
      conversations,
      apiKey,
      pluginKeys,
      serverSideApiKeyIsSet,
      messageIsStreaming,
      modelError,
      loading,
      prompts,
      api,
      selectedPlugins,
      publicPDFLink
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStopConversation = () => {
    abortControllerRef.current?.abort();
  };

  const handleSend = useCallback(
    async (
      message: Message,
      deleteCount = 0,
      plugin: Plugin | null = null,
      uid?: undefined | number,
    ) => {
      if (selectedConversation) {
        let updatedConversation: Conversation;
        if (deleteCount) {
          const updatedMessages = [...selectedConversation.messages];
          for (let i = 0; i < deleteCount; i++) {
            updatedMessages.pop();
          }
          updatedConversation = {
            ...selectedConversation,
            messages: [...updatedMessages, message],
          };
        } else {
          updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
          };
        }
        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
        homeDispatch({ field: 'loading', value: true });
        homeDispatch({ field: 'messageIsStreaming', value: true });
        const { access_token } = await getAccessTokenSilently({
          detailedResponse: true,
        });
        const chatBody: ChatBody = {
          messages: updatedConversation.messages,
          key: access_token,
          prompt: updatedConversation.prompt,
          uid,
          plugins: selectedPlugins,
          api,
        };
        console.log('Messages in request', chatBody.messages);

        const endpoint = getEndpoint(plugin);
        let body;
        if (!plugin) {
          body = JSON.stringify(chatBody);
          if (selectedPlugins.includes("chatpdf")) {
            body = JSON.stringify({
              ...chatBody,
              others: {
                publicPDFLink
              }
            });
          }
          else body = JSON.stringify(chatBody);
        } else {
          body = JSON.stringify({
            ...chatBody,
            googleAPIKey: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
            googleCSEId: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
          });
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          const response = await fetch('api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,

            body,
          });

          if (!response.ok) {
            try {
              toast.error((await response.json())?.error);
            } catch (err) {
              toast.error('Unexpected error');
            }
            return;
          }
          // Response OK!
          const json = await response.json();
          homeDispatch({ field: 'loading', value: false });
          if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }
          let lastMessage;
          for (let i = 1; i < json.choices.length; i++) {
            if (json.choices[i].message.content != "") {
              lastMessage = json.choices[i].message;
              break;
            }
          }
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            lastMessage,
          ];
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            console.log('Aborted');
          } else {
            console.error('Unexpected error', err);
          }
        } finally {
          homeDispatch({
            field: 'selectedConversation',
            value: updatedConversation,
          });
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          saveConversations(updatedConversations);
        }
      }
    },
    [
      apiKey,
      conversations,
      pluginKeys,
      selectedConversation,
      api,
      selectedPlugins,
    ],
  );

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const onClearAll = () => {
    if (
      confirm(t<string>('Are you sure you want to clear all messages?')) &&
      selectedConversation
    ) {
      handleUpdateConversation(selectedConversation, {
        key: 'messages',
        value: [],
      });
    }
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  // useEffect(() => {
  //   console.log('currentMessage', currentMessage);
  //   if (currentMessage) {
  //     handleSend(currentMessage);
  //     homeDispatch({ field: 'currentMessage', value: undefined });
  //   }
  // }, [currentMessage]);

  useEffect(() => {
    throttledScrollDown();
    selectedConversation &&
      setCurrentMessage(
        selectedConversation.messages[selectedConversation.messages.length - 2],
      );
  }, [selectedConversation, throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  return (
    <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
      <div
        className="max-h-full overflow-x-hidden"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {selectedConversation?.messages.length === 0 || !isAuthenticated ? (
          <>
            <div className="mx-auto flex flex-col space-y-1 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
              <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
                {title}
              </div>
              <div className="text-center text-lg text-black dark:text-white">
                <div className="mb-4">
                  Leverage the decentralized power of Bittensor through an
                  accessible chat interface.
                </div>
                {isLoading ? (
                  <div className="flex justify-center mx-auto h-12">
                    <Spinner className="w-10 h-10" />
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <p>
                      Log in to access the Bittensor network and start chatting
                      with the AI.
                    </p>
                    <LoginButton />
                  </>
                ) : (
                  <p className="text-sm">
                    Your conversations are saved locally on your machine.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {selectedConversation?.messages.map((message, index) => (
              <MemoizedChatMessage
                key={index}
                message={message}
                messageIndex={index}
                onEdit={(editedMessage) => {
                  setCurrentMessage(editedMessage);
                  // discard edited message and the ones that come after then resend
                  handleSend(
                    editedMessage,
                    selectedConversation?.messages.length - index,
                  );
                }}
              />
            ))}

            {loading && <ChatLoader />}

            <div
              className="h-[162px] bg-white dark:bg-[#343541]"
              ref={messagesEndRef}
            />
          </>
        )}
      </div>

      <ChatInput
        onStopConversation={handleStopConversation}
        textareaRef={textareaRef}
        onSend={(message, uid, plugin) => {
          setCurrentMessage(message);
          handleSend(message, 0, plugin, uid);
        }}
        onScrollDownClick={handleScrollDown}
        onRegenerate={() => {
          if (currentMessage) {
            const deleteCount =
              selectedConversation?.messages?.at(-1)?.role === 'user' ? 1 : 2;
            handleSend(currentMessage, deleteCount, null);
          }
        }}
        showScrollDownButton={showScrollDownButton}
        disabled={!isAuthenticated}
      />
    </div>
  );
});
Chat.displayName = 'Chat';
