import {
  File,
  FileText,
  Image,
  Music,
  Video,
  Code,
  FileJson,
  Archive,
  Table,
  Presentation,
} from 'lucide-react';

type IconProps = React.ComponentProps<typeof File>;

const fileIconMap: Record<string, React.ComponentType<IconProps>> = {
  // Text files
  txt: FileText,
  md: FileText,
  rtf: FileText,

  // Image files
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  svg: Image,
  webp: Image,

  // Audio files
  mp3: Music,
  wav: Music,
  ogg: Music,

  // Video files
  mp4: Video,
  avi: Video,
  mov: Video,
  webm: Video,

  // Code files
  js: Code,
  ts: Code,
  jsx: Code,
  tsx: Code,
  html: Code,
  css: Code,
  json: FileJson,

  // Document files
  pdf: FileText,

  // Archive files
  zip: Archive,
  rar: Archive,
  '7z': Archive,
  tar: Archive,

  // Spreadsheet files
  xlsx: Table,
  xls: Table,
  csv: Table,

  // Presentation files
  ppt: Presentation,
  pptx: Presentation,
};

export function getFileIcon(filename: string): React.ComponentType<IconProps> {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return fileIconMap[extension] || File;
}

interface FileIconProps extends IconProps {
  filename: string;
}

export function FileIcon({ filename, ...props }: FileIconProps) {
  const IconComponent = getFileIcon(filename);
  return <IconComponent aria-label={`File icon for ${filename}`} {...props} />;
}