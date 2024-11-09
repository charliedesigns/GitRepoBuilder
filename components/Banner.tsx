import React, { CSSProperties } from 'react';

interface CustomizableBannerPreviewProps {
  title?: string;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
}

const CustomizableBannerPreview: React.FC<CustomizableBannerPreviewProps> = ({ title, subtitle, bgColor, textColor }) => {
  const bannerStyle: CSSProperties = {
    backgroundColor: bgColor || "#282c34",
    color: textColor || "#61dafb",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px"
  };

  return (
    <div style={bannerStyle}>
      <h1>{title || "Preview Title"}</h1>
      <p>{subtitle || "Preview subtitle text"}</p>
    </div>
  );
};

export default CustomizableBannerPreview;
