import { useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";

type AvatarCardProps = {
  image?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
};

type UploadCardProp = AvatarCardProps & {
  onFilePicked: (file: File | null) => void;
}

const AvatarCard = ({ image, isSelected, onSelect }: AvatarCardProps) => {
  return (
    <div className="flex justify-center items-center" onClick={onSelect}>
      <Card
        className={`w-[15rem] overflow-hidden hover:shadow-2xl hover:shadow-yellow-200 transition-all duration-200 cursor-pointer ${
          isSelected ? "shadow-yellow-200 shadow-2xl" : null
        }`}
      >
        <CardContent className="flex h-[16rem] justify-center items-center">
          <img
            src={image}
            alt="image1"
            className="h-full rounded-md w-full object-cover"
          />
        </CardContent>
      </Card>
    </div>
  );
};

const UploadCard = ({ icon, isSelected, onSelect, onFilePicked }: UploadCardProp) => {
  const [frontendImage, setFrontendImage] = useState<string | null>(null);
  
  const inputImage = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFrontendImage(file ? URL.createObjectURL(file) : null);
    onFilePicked(file ?? null);
  };

  return (
    <div className="flex justify-center items-center">
      <Card className={`w-[15rem] overflow-hidden hover:shadow-2xl hover:shadow-yellow-200 transition-all duration-200 cursor-pointer ${
          isSelected ? "shadow-yellow-200 shadow-2xl" : null
        }`}>
        <CardContent
          className="flex h-[16rem] justify-center items-center"
          onClick={() => {
            onSelect?.();
            inputImage.current?.click();
          }}
        >
          {frontendImage ? (
            <img
              src={frontendImage}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          ) : (
            icon
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
            ref={inputImage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export { AvatarCard, UploadCard };
