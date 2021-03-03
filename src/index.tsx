import axios from 'axios';
import { Modal, TouchableOpacity, Text } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { theme } from './theme';
import { ScreenShot } from './utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  ReportForm,
  IReportFormValues,
  ReportFormValidation,
  GlobalProps,
  IFeedbackReporterProps,
} from './components';

const queryClient = new QueryClient();

const FeedbackReporter: FunctionComponent<IFeedbackReporterProps> = ({
  mode = 'onScreenShot',
  ...rest
}) => {
  // TODO: use props to set these headers
  axios.defaults.headers.common = {
    Accept: 'application/json',
    Authorization:
      'Basic YXppbS5haG1lZDdAZ21haWwuY29tOjJyRUtraGlpdDN4M2tnR0FwWGVQOTQ5NQ==',
  };
  const formProps = useForm<IReportFormValues>({
    resolver: yupResolver(ReportFormValidation),
    reValidateMode: 'onChange',
    defaultValues: {},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    formProps.register({ name: 'uri' });

    return () => formProps.unregister(['uri']);
  }, [formProps.register]);

  useEffect(() => {
    if (mode !== 'onScreenShot') return;
    ScreenShot.startListener((res?: { uri: string; code: number }) => {
      if (res?.code === 200) {
        setIsModalOpen(true);
        formProps.setValue('uri', res.uri);
      }
    });
  }, [mode]);

  const handleClose = () => setIsModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProps.Provider value={{ mode, ...rest }}>
        <ThemeProvider theme={theme.dark}>
          <Modal
            visible={isModalOpen}
            animationType="slide"
            presentationStyle="pageSheet"
            onDismiss={handleClose}
            onRequestClose={handleClose}
          >
            <TouchableOpacity onPress={handleClose}>
              <Text>Close</Text>
            </TouchableOpacity>
            <FormProvider {...formProps}>
              <ReportForm />
            </FormProvider>
          </Modal>
        </ThemeProvider>
      </GlobalProps.Provider>
    </QueryClientProvider>
  );
};

export default FeedbackReporter;
