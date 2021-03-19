import { NativeModules } from 'react-native';

import type { IFile } from '../../../utils';
import { JIRAApi } from '../JIRAApi.service';
import { uploadFiles } from '../../../utils';

interface IPostJIRAIssueAttachmentsProps {
  key: string;
  files: IFile[];
  content?: string;
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const postJIRAIssueAttachents = ({
  key,
  files,
  content,
}: IPostJIRAIssueAttachmentsProps) =>
  uploadFiles({
    toUrl: `${JIRAApi.defaults.baseURL}issue/${key}/attachments`,
    headers: {
      ...JIRAApi.defaults.headers.common,
      'X-Atlassian-Token': 'no-check',
    },
    files: [
      ...files,
      {
        content,
        name: 'file',
        filename,
        filepath,
        filetype: 'image/png',
      },
    ],
  });
