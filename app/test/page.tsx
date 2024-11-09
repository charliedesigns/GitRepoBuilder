"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomizableBannerPreview from '@/components/Banner';

const CMSPreviewPage = () => {
  const searchParams = useSearchParams();
  const repoName = searchParams.get('repoName') || '';
  const [title, setTitle] = useState("Welcome");
  const [subtitle, setSubtitle] = useState("This is a customizable banner.");
  const [bgColor, setBgColor] = useState("#ff5722");
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    console.log("Received repoName in CMSPreviewPage:", repoName);
  }, [repoName]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedConfig = {
      banner: {
        title,
        subtitle,
        bgColor,
        textColor,
      }
    };

    const payload = {
      ...updatedConfig,
      repoName,
      owner: "charliedesigns",
    };

    console.log("Payload to be sent:", payload);

    await fetch("/api/updateConfig", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(JSON.stringify(payload))
  };

  return (
    <div>
      <h2>Customize Your Banner</h2>
      <div>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Subtitle:
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>
        <label>
          Background Color:
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </label>
        <label>
          Text Color:
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        </label>
        <button type="submit" onClick={handleSubmit}>Save</button>
      </div>

      <h3>Live Preview</h3>
      <CustomizableBannerPreview
        title={title}
        subtitle={subtitle}
        bgColor={bgColor}
        textColor={textColor}
      />
    </div>
  );
};

export default CMSPreviewPage;