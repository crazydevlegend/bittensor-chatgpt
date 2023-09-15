import { useAuth0 } from '@auth0/auth0-react';
import {
  IconArrowBack,
  IconCopy,
  IconEdit,
  IconExternalLink,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAPIFetch } from '../hooks/useAPIFetch';

import { title } from '@/utils/app/const';

import { APIKeyOperations } from '@/components/APIKeyOperations';
import Button from '@/components/Button';
import { ApiKeyModal } from '@/components/Profile/ApiKeyModal';
import Spinner from '@/components/Spinner';

import { DateTime } from 'luxon';

const requestDocsUrl =
  'https://github.com/fabhed/validator-endpoint/blob/main/docs/requests.md';

const Profile = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'edit' | 'new'>('edit');
  const [apiKey, setApiKey] = useState(null);

  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const apiFetch = useAPIFetch();

  const {
    isLoading: apiKeysIsLoading,
    error: apiKeyError,
    data: apiKeys,
    refetch: refetchApiKeys,
  } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => apiFetch('/api-keys/'),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const updateMutation = useMutation({
    mutationFn: (apiKey: any) =>
      apiFetch('/api-keys/' + apiKey.id, {
        method: 'PATCH',
        body: JSON.stringify(apiKey),
      }),
    onSuccess: (data) => {
      refetchApiKeys();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (apiKey: any) =>
      apiFetch('/api-keys/' + apiKey.id, {
        method: 'DELETE',
      }),
    onSuccess: (data) => {
      refetchApiKeys();
    },
  });

  const createMutation = useMutation({
    mutationFn: (apiKey: any) =>
      apiFetch('/api-keys/', {
        method: 'POST',
        body: JSON.stringify(apiKey),
      }),
    onSuccess: (data) => {
      refetchApiKeys();
    },
  });

  const handleApiKeyUpdate = async (apiKey: any) => {
    await updateMutation.mutate(apiKey);
  };

  const editApiKey = (apiKey: any) => {
    setApiKey(apiKey);
    setModalType('edit');
    setShowModal(true);
  };

  const createApiKey = () => {
    createMutation.mutate({});
  };

  const deleteApiKey = (apiKey: any) => {
    deleteMutation.mutate(apiKey);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log('API Key copied to clipboard'))
      .catch((err) =>
        console.error('Could not copy API Key to clipboard', err),
      );
    toast.success('API Key copied to clipboard!');
  };

  return (
    <>
      {showModal &&
        (modalType === 'new' || (modalType === 'edit' && apiKey)) && (
          <ApiKeyModal
            apiKey={apiKey}
            onClose={() => setShowModal(false)}
            onUpdate={handleApiKeyUpdate}
            type={modalType}
          />
        )}
      <Head>
        <title>{title}</title>
        <meta name="description" content="Manage Usage & API Keys" />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={`flex h-screen w-screen flex-col text-sm bg-[#202123] text-white dark:text-white p-6`}
      >
        <div className="mx-auto max-w-[1200px] bg-[#343541] text-white p-4 rounded-md">
          {/* Back arrow and profile title */}
          <div className="flex items-center mb-4 text-4xl">
            <button
              onClick={() => {
                router.push('/');
              }}
              className="mr-4"
            >
              <IconArrowBack size="1em" />
            </button>
            <h1>My profile</h1>
          </div>

          {/* User details */}
          <div className="mb-6 flex justify-center flex-col items-center ">
            <div></div>
            {isLoading ? (
              <div className="rounded-full w-[100px] h-[100px] bg-slate-500"></div>
            ) : (
              <Image
                className="rounded-full"
                src={user?.picture!}
                alt={user?.name || 'Profile Picture'}
                width={100}
                height={100}
              />
            )}
            <div className="text-xl mt-4">
              {isLoading ? (
                <Spinner className="border-t-white h-7 w-7" />
              ) : (
                <p>{user?.name}</p>
              )}
            </div>
          </div>

          {/* Lifetime Usage and API keys */}
          <section className="mb-6">
            {/* <h2>Lifetime-Usage</h2> */}
            {/* Content related to Lifetime-Usage */}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg">API keys</h2>
            <table className="table-auto w-full text-sm text-left">
              <thead className="text-xs uppercase ">
                <tr>
                  <th className="px-4 py-1">Name</th>
                  <th className="px-4 py-1">Key</th>
                  <th className="px-4 py-1">Created</th>
                  <th className="px-4 py-1">Credits</th>
                  <th className="px-4 py-1">Requests</th>
                  <th className="px-4 py-1">Default Query Strategy</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {apiKeys &&
                  apiKeys.map((apiKey: any) => (
                    <tr key={apiKey.id}>
                      <td className="px-4 py-1">{apiKey.name}</td>
                      <td className="px-4 py-1 flex gap-1 items-center">
                        {apiKey.api_key_hint}{' '}
                        <button
                          title="Copy"
                          onClick={() => handleCopy(apiKey.api_key)}
                        >
                          <IconCopy size="1em"></IconCopy>
                        </button>
                      </td>
                      <td className="px-4 py-1">
                        {DateTime.fromSeconds(
                          Number(apiKey.created_at),
                        ).toFormat('MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-1">{apiKey.credits}</td>
                      <td className="px-4 py-1">{apiKey.request_count}</td>
                      <td className="px-4 py-1">
                        {apiKey.default_query_strategy || 'Unspecified'}
                      </td>
                      <td className="px-4 py-1 flex">
                        <button
                          className="hover:bg-slate-600 p-1 rounded-md"
                          onClick={() => editApiKey(apiKey)}
                        >
                          <IconEdit size="1em"></IconEdit>
                        </button>
                        <button
                          className="hover:bg-slate-600 p-1 rounded-md ml-2"
                          onClick={() => deleteApiKey(apiKey)}
                        >
                          <IconTrash size="1em"></IconTrash>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex justify-between">
              <Button onClick={createApiKey}>
                {' '}
                <IconPlus size={'1em'} />
                Create API Key
              </Button>
              <a
                href={requestDocsUrl}
                target="_blank"
                className="text-lg flex gap-1 items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Request guide
                <IconExternalLink size="1em" />
              </a>
            </div>
            <APIKeyOperations
              prompt={'Tell a joke'}
              url={process.env.NEXT_PUBLIC_VALIDATOR_ENDPOINT_BASE_URL!}
              apiKeys={apiKeys || []}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default Profile;
