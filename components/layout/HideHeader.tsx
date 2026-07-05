"use client";

export default function HideHeader() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      header {
        display: none !important;
      }
    `}} />
  );
}