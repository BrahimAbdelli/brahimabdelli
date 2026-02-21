'use client';

import React, { useEffect, useRef } from 'react';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';

import { useSiteSettingStore } from 'src/store/siteSetting';
import { useTranslation } from 'next-i18next';
import type { UseTranslationCommon } from 'src/types/types';

interface SearchFormProps {
  searchValue?: string;
  autoInputHidden?: boolean;
  autoFocus?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchValue,
  autoInputHidden = false,
  autoFocus = false
}): React.JSX.Element => {
  const router: ReturnType<typeof useRouter> = useRouter();
  const searchInputRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common') as UseTranslationCommon;

  const handleSearchSubmit: (evt: React.FormEvent<HTMLFormElement>) => void = (evt: React.FormEvent<HTMLFormElement>): void => {
    evt.stopPropagation();
    evt.preventDefault();
    const form: HTMLFormElement = evt.target as HTMLFormElement;
    const searchValueFromForm: string | undefined = form?.['search']?.value?.trim();
    if (searchValueFromForm) {
      useSiteSettingStore.getState().closeSideBarMenu();
      router.push(`/s/${searchValueFromForm}`);
    }
  };

  useEffect((): void => {
    const searchInput: HTMLInputElement | null = searchInputRef.current;
    if (searchValue || !autoFocus || !searchInput) {
      return;
    }
    searchInput.focus();
    if (typeof searchInput.selectionStart === 'number') {
      searchInput.selectionStart = searchInput.selectionEnd = searchInput.value.length;
    }
  }, [autoFocus, searchValue]);

  return (
    <form onSubmit={handleSearchSubmit} className='w-full'>
      <div
        className={classNames(
          'flex items-center overflow-hidden rounded-lg border border-base-300 bg-base-200/80 shadow-sm',
          'focus-within:outline focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-base-content/20',
          autoInputHidden ? 'hidden sm:flex' : 'flex'
        )}
      >
        <input
          ref={searchInputRef}
          className={classNames(
            'min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm',
            'placeholder:text-base-content/50 focus:outline-none focus:ring-0',
            autoInputHidden ? 'hidden sm:block' : null
          )}
          defaultValue={searchValue}
          type='text'
          name='search'
          placeholder={t('header.titlesearch')}
          aria-label='search-input'
        />
        <button
          type='submit'
          className='flex shrink-0 items-center justify-center p-2 text-base-content/70 transition-colors hover:bg-base-300/50 hover:text-base-content'
          aria-label='search-button'
        >
          <AiOutlineSearch className='text-lg' />
        </button>
      </div>
    </form>
  );
};
SearchForm.displayName = 'SearchForm';
