import { IconPlug } from '@tabler/icons-react';
import { KeyboardEvent, use, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';


import HomeContext from '@/pages/api/home/home.context';

import { SidebarButton } from '@/components/Sidebar/SidebarButton';

import ChatbarContext from '../Chatbar.context';
import Checkbox from '@/components/Checkbox';
import useApi from '@/hooks/useApi';
import axios from "axios"

interface Plugin {
  id: string;
  name: string;
  description: string;
}

export const Plugins = () => {
  const { t } = useTranslation('sidebar');
  const { data: plugins }: { data: Plugin[] } = useApi('/api/plugins');
  const [query, setQuery] = useState('');

  const filteredPlugins = useMemo(() => {
    if(!plugins) return [];
    return plugins.filter((plugin: Plugin) => {
      return plugin.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, plugins]);

  const {
    state: { selectedPlugins },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const { handlePluginsChange } =
    useContext(ChatbarContext);

  const [isChanging, setIsChanging] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsChanging(false);
    }
  };

  const [file, setFile] = useState<String>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    console.log(file);
    const config = {
      headers: {
        "x-api-key": `${process.env.NEXT_PUBLIC_CHATPDF_API_KEY}`,
        "Content-Type": "application/json",
      },
    };
    
    const data = {
      url: file,
    };
    
    await axios
      .post("https://api.chatpdf.com/v1/sources/add-url", data, config)
      .then((response) => {
        console.log("Source ID:", response.data.sourceId);
        homeDispatch({ field: 'publicPDFLink', value: response.data.sourceId});
        alert("Success!");
      })
      .catch((error) => {
        console.log("Error:", error.message);
        console.log("Response:", error.response.data);
        alert("Feild! Please try again.");
      });
  }

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      setIsChanging(false);
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <SidebarButton
        text={t('Plugins')}
        icon={<IconPlug />}
        onClick={() => setIsChanging(true)}
      />

      {isChanging && (
        <div
          className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onKeyDown={handleEnter}
        >
          <div className="fixed inset-0 z-10 overflow-hidden">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              />

              <div
                ref={modalRef}
                className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
                role="dialog"
              >
                <div className="mb-2 text-2xl">Select Plugins</div>

                <div className='flex space-x-2'>
                  <input
                    className="w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-100 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                    placeholder='Plugin Search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {/* <button
                    type="button"
                    className="w-1/4 rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                    onClick={() => setIsChanging(false)}
                  >
                    {t('All')}
                  </button>
                  <button
                    type="button"
                    className="w-1/4 rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                    onClick={() => setIsChanging(false)}
                  >
                    {t('Selected')}
                  </button> */}
                </div>
                <div className='max-h-[400px] overflow-auto divide-y'>
                  {
                    filteredPlugins.map((plugin:Plugin, index: number) => (
                      <div className="mt-4 pt-2 px-2" key={index}>
                        <div className="text-xl font-bold flex gap-2">
                          <Checkbox 
                            label={plugin.name}
                            checked={selectedPlugins.includes(plugin.id)}
                            onChange={() => {
                              if (selectedPlugins.includes(plugin.id)) {
                                handlePluginsChange(selectedPlugins.filter((id) => id !== plugin.id));
                              } else {
                                handlePluginsChange([...selectedPlugins, plugin.id]);
                              }
                            }}
                          />
                          {
                            plugin.id === "chatpdf" && <form onSubmit={onSubmit} className='text-sm'>
                              <input
                                className="rounded-lg border border-neutral-500 px-3 py-1 mr-3 text-neutral-900 shadow focus:outline-none dark:border-neutral-100 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                                onChange={(e) => setFile(e.target.value)}
                                placeholder='Public PDF URL'
                              />
                            <input type="submit" value="Submit" className='cursor-pointer'/>
                          </form>
                          }
                        </div>
                        <div className="mt-2 italic">
                          {plugin.description}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
