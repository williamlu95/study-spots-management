import { CloudUpload } from '@mui/icons-material';
import {
  Paper,
  Typography,
  Stack,
  ButtonBase,
  ImageList,
  ImageListItem,
  CircularProgress,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import useImageService from '../hooks/useImageService';
import FormSectionHeader from './FormSectionHeader';
import { AxiosProgressEvent } from 'axios';
import Image from 'next/image';

type ImageType = {
  id?: string;
  fileName: string;
  caption?: string;
};

type Props = {
  images: ImageType[];
  onImagesChange: (images: ImageType[]) => void;
};

export default function ImagesInput({
  images,
  onImagesChange,
}: Props): JSX.Element {
  const { uploadImage, generateNewFileName } = useImageService();
  const [stateImages, setStateImages] = useState<ImageType[]>(images);
  const [imagesLoaded, setImagesLoaded] = useState(
    new Set(Object.values(images).map(({ fileName }) => fileName)),
  );
  const [imagesLoading, setImagesLoading] = useState<
    Record<string, number | undefined>
  >({});

  const areImagesLoading = () => {
    return Object.values(imagesLoading).some(
      (loaded) => typeof loaded === 'number',
    );
  };

  useEffect(() => {
    const imageKeys = images.map(
      ({ fileName, caption }) => `${fileName}${caption}`,
    );

    const imageSet = new Set(imageKeys);

    const isSameImages =
      stateImages.every(({ fileName, caption }) =>
        imageSet.has(`${fileName}${caption}`),
      ) && stateImages.length === images.length;

    if (areImagesLoading() || isSameImages) {
      return;
    }

    onImagesChange(stateImages);
  }, [stateImages, imagesLoading]);

  const handleImageUploadProgress =
    (fileName: string) => (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) {
        return;
      }

      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      setImagesLoading((imagesLoading) => ({
        ...imagesLoading,
        [fileName]: percentCompleted,
      }));
    };

  const handleFileUploadClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const processImage = async (file: File, fileName: string) => {
    const uploadSuccessful = await uploadImage(
      file,
      fileName,
      handleImageUploadProgress(fileName),
    );

    setImagesLoading((imagesLoading) => ({
      ...imagesLoading,
      [fileName]: undefined,
    }));

    if (!uploadSuccessful) {
      setStateImages(
        stateImages.filter((stateImage) => stateImage.fileName !== fileName),
      );
      return;
    }

    imagesLoaded.add(fileName);
    setImagesLoaded(new Set(imagesLoaded));
  };

  const handleFilesUploaded = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const { files } = e.target;

    const newImagesLoading: Record<string, number> = {};

    const newImages = Array.from(files).map((file) => {
      const newFileName = generateNewFileName(file.name);
      newImagesLoading[newFileName] = 0;
      return { fileName: newFileName, caption: '' };
    });

    setImagesLoading((imagesLoading) => ({
      ...newImagesLoading,
      ...imagesLoading,
    }));

    setStateImages((stateImages) => [...newImages, ...stateImages]);

    await Promise.all(
      newImages.map((newImage, index) =>
        processImage(files[index], newImage.fileName),
      ),
    );
  };

  const renderImage = (imageFileName: string) => {
    if (typeof imagesLoading[imageFileName] === 'number') {
      return (
        <Stack height="100%" alignItems="center" justifyContent="center">
          <CircularProgress
            variant="determinate"
            value={imagesLoading[imageFileName]}
          />
        </Stack>
      );
    }

    if (imagesLoaded.has(imageFileName)) {
      return (
        <Image
          alt="Study Spot Image"
          src={`${process.env.NEXT_PUBLIC_SPACE_URL}/${imageFileName}`}
          width={120}
          height={140}
        />
      );
    }

    return <></>;
  };

  return (
    <>
      <FormSectionHeader label="Images" />

      <Paper sx={{ border: 1, borderStyle: 'dashed' }}>
        <ButtonBase
          sx={{ width: '100%' }}
          onClick={handleFileUploadClick}
          disabled={areImagesLoading()}
        >
          <Stack alignItems="center" py={4}>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFilesUploaded}
            />
            <CloudUpload />

            <Typography variant="h6" fontWeight={300} component="div">
              Drag and drop or click here to upload images
            </Typography>
          </Stack>
        </ButtonBase>
      </Paper>

      <ImageList
        rowHeight={150}
        style={{
          gridAutoFlow: 'column',
          gridTemplateColumns: 'repeat(auto-fill, 120px)',
          gridAutoColumns: '120px',
        }}
      >
        {stateImages.map((stateImages) => (
          <ImageListItem key={stateImages.fileName}>
            <Paper
              elevation={1}
              sx={{ height: '140px', mb: 1, width: '120px' }}
            >
              {renderImage(stateImages.fileName)}
            </Paper>
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
