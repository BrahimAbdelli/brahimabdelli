import React, { ReactElement } from 'react';

import { render, RenderOptions } from '@testing-library/react';

import { NotionZustandContext, initializeNotionStore } from 'src/store/notion';

interface AllTheProvidersProps {
  children: React.ReactNode;
  notionState?: Parameters<typeof initializeNotionStore>[0];
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  notionState
}: AllTheProvidersProps): ReactElement => {
  const notionStore = notionState ? initializeNotionStore(notionState) : undefined;

  if (notionStore) {
    return (
      <NotionZustandContext.Provider value={notionStore}>{children}</NotionZustandContext.Provider>
    );
  }

  return <>{children}</>;
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  notionState?: Parameters<typeof initializeNotionStore>[0];
}

const customRender = (
  ui: ReactElement,
  { notionState, ...renderOptions }: CustomRenderOptions = {}
): ReturnType<typeof render> => {
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} notionState={notionState} />,
    ...renderOptions
  });
};

export * from '@testing-library/react';
export { customRender as render };

