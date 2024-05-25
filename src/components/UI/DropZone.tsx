import { ReactNode, createContext, useContext, useState } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useDropArea } from "../../hooks/useDropArea";

import { cn } from "../../utils/styles";
import { createFileList, isExtensionValid } from "../../utils/form";
import { nanoid } from "nanoid";

import ErrorMessage from "./ErrorMessage";

type ContextType = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  extensionError: string | null;
  handleExtensionError: (fileArr: File[]) => void;
};

const DropZoneContext = createContext<ContextType | null>(null);

type DropZoneProps = {
  children: ReactNode;
};

const DropZone = ({ children }: Readonly<DropZoneProps>) => {
  const [files, setFiles] = useState<File[]>([]);
  const [extensionError, setExtensionError] = useState<string | null>(null);

  function handleExtensionError(fileArr: File[]) {
    if (fileArr.length === 0) {
      setExtensionError("Unsupported file format");
    } else {
      setExtensionError(null);
    }
  }

  return (
    <DropZoneContext.Provider
      value={{
        files,
        setFiles,
        handleExtensionError,
        extensionError,
      }}
    >
      {children}
    </DropZoneContext.Provider>
  );
};

type DropZoneAreaProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  allowedExtensions: string[];
  triggerRef: React.RefObject<HTMLElement>;
};

const DropZoneArea = <T extends FieldValues>({
  triggerRef,
  register,
  name,
  error,
  allowedExtensions,
}: Readonly<DropZoneAreaProps<T>>) => {
  const { isDragging, dropArea } = useDropArea(triggerRef);

  const { files, setFiles, handleExtensionError } =
    useContext(DropZoneContext)!;

  const { ref, onChange, ...restRegister } = register(name);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filesArr = Array.from(e.target.files!);

    const filteredFiles = filesArr.filter((file) =>
      isExtensionValid(file.name, allowedExtensions),
    );

    setFiles((prev) => [...prev, ...filteredFiles]);

    handleExtensionError(filteredFiles);

    const fileList = createFileList([...files, ...filteredFiles]);

    e.target.files = fileList.files;

    onChange(e);
  }

  return (
    <>
      {isDragging && <div className="h-[120px]"></div>}
      <div
        className={cn("relative h-[120px] w-full", {
          "absolute left-0 top-0 z-10 m-10 h-[calc(100%-80px)] w-[calc(100%-80px)] bg-white":
            isDragging,
        })}
      >
        <input
          className="peer absolute left-0 top-0 z-[1] h-full w-full rounded-[20px] text-[0px] opacity-0 hover:cursor-pointer"
          ref={(elem: HTMLInputElement) => {
            ref(elem);
            dropArea.current = elem;
          }}
          type="file"
          multiple
          onChange={handleChange}
          accept={allowedExtensions.join(", ")}
          {...restRegister}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-full rounded-[20px] border border-dashed border-gray-400 peer-hover:bg-gray-50 peer-focus:bg-gray-100",
            {
              "after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[url('/plus.svg')]":
                !isDragging,
              "-z-[1] flex items-center justify-center": isDragging,
              "border-error": error,
            },
          )}
        >
          {isDragging && (
            <div className="flex flex-col gap-4">
              <p className="text-center text-2xl font-medium text-gray-950">
                Drop files here
              </p>
              <p className="text-center text-xl text-gray-700">
                Put your files in this field
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

type DropZoneTextProps = {
  children: ReactNode;
};

const DropZoneText = ({ children }: Readonly<DropZoneTextProps>) => {
  return <>{children}</>;
};

type DropZoneFileListProps<T extends FieldValues> = {
  name: Path<T>;
  setFormValue: UseFormSetValue<T>;
};

const DropZoneFileList = <T extends FieldValues>({
  name,
  setFormValue,
}: Readonly<DropZoneFileListProps<T>>) => {
  const { files, setFiles } = useContext(DropZoneContext)!;

  function deleteFile(deletionIndex: number) {
    const newFiles = files.filter((_, i) => i !== deletionIndex);

    const fileList = createFileList(newFiles);

    setFiles(newFiles);

    setFormValue(name, fileList.files as PathValue<FileList, Path<unknown>>, {
      shouldValidate: true,
    });
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {files.map((file, index) => (
        <DropZoneFileListItem key={nanoid()} onClick={() => deleteFile(index)}>
          {file.name}
        </DropZoneFileListItem>
      ))}
    </ul>
  );
};

type DropZoneFileListItemProps = {
  children: ReactNode;
  onClick: () => void;
};

const DropZoneFileListItem = ({
  children,
  onClick,
}: Readonly<DropZoneFileListItemProps>) => {
  return (
    <li className="relative inline-flex items-center gap-2 rounded-full bg-gray-100 px-[6px] py-[2px] pl-[26px] text-xs text-gray-950 before:absolute before:left-[6px] before:top-1/2 before:h-4 before:w-4 before:-translate-y-1/2 before:content-[url('/file.svg')]">
      <span className="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap">
        {children}
      </span>
      <button
        className="relative h-5 w-5 after:absolute after:left-0 after:top-1/2 after:h-full after:w-full after:-translate-y-1/2 after:content-[url('/cross.svg')]"
        onClick={onClick}
        type="button"
      ></button>
    </li>
  );
};

type DropZoneErrorMessageProps = {
  error: FieldError | undefined;
};

const DropZoneErrorMessage = ({
  error,
}: Readonly<DropZoneErrorMessageProps>) => {
  const { extensionError } = useContext(DropZoneContext)!;

  return <ErrorMessage errorMessage={extensionError ?? error?.message} />;
};

DropZone.Area = DropZoneArea;
DropZone.Text = DropZoneText;
DropZone.FileList = DropZoneFileList;
DropZone.ErrorMessage = DropZoneErrorMessage;

export default DropZone;
