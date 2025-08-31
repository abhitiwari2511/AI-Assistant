import { AvatarCard, UploadCard } from "@/components/AvatarCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const CustomizePage = () => {
  const image: { imgUrl?: string; icon?: React.ReactNode }[] = [
    {
      imgUrl:
        "https://imgs.search.brave.com/hTqDqksR3kZeV0giH8kuTXtLCSkKE4es3Y4GSw6uvbU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/ZXhwcmVzc2l2ZS1j/YXJ0b29uLWZhY2Ut/aWxsdXN0cmF0aW9u/XzEzMDgtMTY1NDU0/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA",
    },
  ];
  const icon = <LuImagePlus size={50} />;
  const [selectedKey, setSelectedKey] = useState<string>("image-0");
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex flex-col justify-center items-center h-screen max-w-5xl">
      <h1 className="text-3xl text-yellow-200 font-bold mb-14">
        Your Assistant Avatar
      </h1>
      <div className="flex items-center gap-14">
        {image.map(({ imgUrl }, index) => {
          const key = `image-${index}`;
          return (
            <AvatarCard
              key={index}
              image={imgUrl}
              isSelected={selectedKey === key}
              onSelect={() => setSelectedKey(key)}
            />
          );
        })}
        <UploadCard
          icon={icon}
          isSelected={selectedKey === "input"}
          onSelect={() => setSelectedKey("input")}
        />
      </div>
      <Button className="mt-12 hover:bg-cyan-200 cursor-pointer rounded-full bg-white text-black text-2xl h-[3rem] w-[8rem]" onClick={() => navigate("/ai-name")}>
        Next
      </Button>
    </div>
  );
};

export default CustomizePage;
