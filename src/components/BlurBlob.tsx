import React from "react";

interface BlurBlobProps {
  position: {
    top: string;
    left: string;
  };
  size: {
    width: string;
    height: string;
  };
}

const BlurBlob: React.FC<BlurBlobProps> = ({ position, size }) => {
  return (
    <div
      className="absolute -z-10"
      style={{
        top: position.top,
        left: position.left,
        width: size.width,
        height: size.height,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="w-full h-full bg-primary rounded-full opacity-20 blur-3xl animate-blob" />
    </div>
  );
};

export default BlurBlob;
