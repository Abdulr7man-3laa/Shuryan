import { useState, useCallback, useEffect } from 'react';

export const useDoctorCanvas = (canvasRef, doctorsData) => {
  const [doctorImages, setDoctorImages] = useState(Array(6).fill(null));
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const config = {
    colors: { 
      primary: '#4FD1C5', 
      white: '#FFFFFF', 
      darkText: '#2D3748', 
      lightText: '#718096', 
      star: '#FBBF24', 
      shadow: 'rgba(0, 0, 0, 0.08)', 
      icon: '#A0AEC0', 
      separator: '#E2E8F0' 
    },
    padding: 35,
    borderRadius: 20
  };

  const icons = {
    briefcase: 'M7.5 7.5C7.5 5.843 8.843 4.5 10.5 4.5h3C15.157 4.5 16.5 5.843 16.5 7.5v.75H18.75c1.243 0 2.25 1.007 2.25 2.25v6c0 1.243-1.007 2.25-2.25 2.25H5.25c-1.243 0-2.25-1.007-2.25-2.25v-6c0-1.243 1.007 2.25 2.25-2.25H7.5V7.5zM9 8.25V7.5c0-.828.672-1.5 1.5-1.5h3c.828 0 1.5.672 1.5 1.5v.75H9z',
    location: 'M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z'
  };

  const drawRoundedRect = useCallback((ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }, []);

  const drawCardBackground = useCallback((ctx, w, h) => {
    ctx.save();
    ctx.shadowColor = config.colors.shadow;
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    drawRoundedRect(ctx, 0, 0, w, h, config.borderRadius);
    ctx.fillStyle = config.colors.white;
    ctx.fill();
    ctx.restore();
  }, [config.colors.shadow, config.borderRadius, drawRoundedRect]);

  const drawGradientOverlay = useCallback((ctx, w, h) => {
    ctx.save();
    const gradient = ctx.createLinearGradient(0, 0, w, h * 0.8);
    gradient.addColorStop(0, 'rgba(79, 209, 197, 0.35)');
    gradient.addColorStop(1, 'rgba(79, 209, 197, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }, []);

  const drawDoctorImage = useCallback((ctx, w, h, image) => {
    const imgWidth = w * 0.5;
    const imgHeight = h;
    if (!image || !image.complete || image.naturalHeight === 0) {
      ctx.save();
      ctx.fillStyle = '#F7FAFC';
      ctx.fillRect(0, 0, imgWidth, imgHeight);
      ctx.font = '16px Cairo';
      ctx.fillStyle = config.colors.lightText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('يرجى تحميل الصور', imgWidth / 2, imgHeight / 2);
      ctx.restore();
      return;
    }
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;
    const containerAspectRatio = imgWidth / imgHeight;
    let sx = 0, sy = 0, sWidth, sHeight;
    if (imageAspectRatio > containerAspectRatio) {
      sHeight = image.naturalHeight;
      sWidth = sHeight * containerAspectRatio;
      sx = (image.naturalWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = image.naturalWidth;
      sHeight = sWidth / containerAspectRatio;
      sy = (image.naturalHeight - sHeight) / 2;
      sx = 0;
    }
    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, imgWidth, imgHeight);
  }, [config.colors.lightText]);

  const drawStar = useCallback((ctx, cx, cy, spikes = 5, outerRadius, innerRadius) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }, []);

  const wrapText = useCallback((ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      if (lineCount >= 2) break;
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        lineCount++;
      } else {
        line = testLine;
      }
    }
    if (lineCount < 2) {
      ctx.fillText(line.trim(), x, currentY);
    }
  }, []);

  const drawIcon = useCallback((ctx, path, x, y, size) => {
    ctx.save();
    const p = new Path2D(path);
    const scale = size / 24;
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = config.colors.icon;
    ctx.fill(p);
    ctx.restore();
  }, [config.colors.icon]);

  const drawRatingStars = useCallback((ctx, x, y, rating, starSize = 18, ratingText) => {
    const starSpacing = starSize * 1.2;
    ctx.font = `700 ${Math.max(16, starSize * 0.8)}px Cairo`;
    ctx.fillStyle = config.colors.lightText;
    ctx.textAlign = 'right';
    ctx.fillText(ratingText, x, y + 5);
    const textWidth = ctx.measureText(ratingText).width;
    const starBlockRightEdge = x - textWidth - 10;
    ctx.save();
    for (let i = 0; i < 5; i++) {
      const currentStarX = starBlockRightEdge - (i * starSpacing) - (starSize / 2);
      ctx.fillStyle = i < Math.floor(rating) ? config.colors.star : config.colors.separator;
      drawStar(ctx, currentStarX, y, 5, starSize / 2, starSize / 4);
      ctx.fill();
    }
    ctx.restore();
  }, [config.colors.lightText, config.colors.star, config.colors.separator, drawStar]);

  const drawActions = useCallback((ctx, w, h, x, contentAreaWidth) => {
    const actionHeight = 48;
    const buttonWidth = Math.min(140, contentAreaWidth / 2 - 10);
    const buttonGap = 15;
    const buttonFontSize = Math.max(16, w * 0.019);
    const buttonsY = h - actionHeight - config.padding;
    const rightEdge = x + contentAreaWidth;
    const bookButtonX = rightEdge - buttonWidth;
    drawRoundedRect(ctx, bookButtonX, buttonsY, buttonWidth, actionHeight, 12);
    ctx.fillStyle = config.colors.primary;
    ctx.fill();
    ctx.font = `bold ${buttonFontSize}px Cairo`;
    ctx.fillStyle = config.colors.white;
    ctx.textAlign = 'center';
    ctx.fillText('احجز الآن', bookButtonX + buttonWidth / 2, buttonsY + actionHeight / 2 + 6);
    const profileButtonX = bookButtonX - buttonGap - buttonWidth;
    ctx.fillStyle = config.colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText('الملف الشخصي', profileButtonX + buttonWidth / 2, buttonsY + actionHeight / 2 + 6);
    ctx.textAlign = 'right';
  }, [config.padding, config.colors.primary, config.colors.white, drawRoundedRect]);

  const drawDoctorInfo = useCallback((ctx, w, h, doctor) => {
    ctx.save();
    ctx.direction = 'rtl';
    const imgWidth = w * 0.5;
    const contentStartX = imgWidth + config.padding;
    const contentAreaX = w - config.padding;
    const contentAreaWidth = contentAreaX - contentStartX;
    const actionHeight = 48;
    const contentTopY = config.padding;
    const contentBottomY = h - config.padding - actionHeight;
    const availableHeight = contentBottomY - contentTopY;
    let currentY = contentTopY + (availableHeight * 0.05);
    const nameFontSize = Math.max(28, w * 0.038);
    ctx.font = `800 ${nameFontSize}px Cairo`;
    ctx.fillStyle = config.colors.darkText;
    ctx.textAlign = 'right';
    ctx.fillText(doctor.name, contentAreaX, currentY);
    currentY += nameFontSize * 1.3;
    const specialtyFontSize = Math.max(19, w * 0.023);
    ctx.font = `700 ${specialtyFontSize}px Cairo`;
    ctx.fillStyle = config.colors.primary;
    ctx.fillText(doctor.specialty, contentAreaX, currentY);
    currentY = contentTopY + (availableHeight * 0.28);
    drawRatingStars(ctx, contentAreaX, currentY, doctor.rating, 20, `${doctor.rating} (${doctor.reviews} تقييم)`);
    currentY = contentTopY + (availableHeight * 0.45);
    const bioFontSize = Math.max(17, w * 0.021);
    ctx.font = `500 ${bioFontSize}px Cairo`;
    ctx.fillStyle = config.colors.lightText;
    wrapText(ctx, doctor.bio, contentAreaX, currentY, contentAreaWidth, bioFontSize * 1.8);
    currentY = contentTopY + (availableHeight * 0.85);
    const metaFontSize = Math.max(16, w * 0.019);
    ctx.font = `700 ${metaFontSize}px Cairo`;
    ctx.fillStyle = config.colors.darkText;
    ctx.fillText(doctor.experience, contentAreaX - 30, currentY + 5);
    drawIcon(ctx, icons.briefcase, contentAreaX - 5, currentY - 8, 20);
    const locationTextWidth = ctx.measureText(doctor.location).width;
    ctx.fillText(doctor.location, contentStartX + locationTextWidth + 30, currentY + 5);
    drawIcon(ctx, icons.location, contentStartX + locationTextWidth + 38, currentY - 8, 20);
    drawActions(ctx, w, h, contentStartX, contentAreaWidth);
    ctx.restore();
  }, [config.padding, config.colors.darkText, config.colors.primary, config.colors.lightText, drawRatingStars, wrapText, drawIcon, icons, drawActions]);

  const drawCard = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = Math.min((rect.width * 0.58) * dpr, 580 * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${canvas.height / dpr}px`;
    ctx.scale(dpr, dpr);
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;
    ctx.clearRect(0, 0, canvasW, canvasH);
    drawCardBackground(ctx, canvasW, canvasH);
    ctx.save();
    drawRoundedRect(ctx, 0, 0, canvasW, canvasH, config.borderRadius);
    ctx.clip();
    drawGradientOverlay(ctx, canvasW, canvasH);
    drawDoctorImage(ctx, canvasW, canvasH, doctorImages[index]);
    drawDoctorInfo(ctx, canvasW, canvasH, doctorsData[index]);
    ctx.restore();
  }, [doctorImages, config.borderRadius, drawCardBackground, drawRoundedRect, drawGradientOverlay, drawDoctorImage, drawDoctorInfo, doctorsData]);

  const preloadImages = useCallback(() => {
    let loadedCount = 0;
    const totalImages = doctorsData.length;
    const newImages = [...doctorImages];
    doctorsData.forEach((doctor, index) => {
      if (!doctor.imageSrc) {
        newImages[index] = null;
        loadedCount++;
        if (loadedCount === totalImages) {
          setDoctorImages(newImages);
          setImagesLoaded(true);
        }
        return;
      }
      const img = new Image();
      img.src = doctor.imageSrc;
      img.onload = () => {
        newImages[index] = img;
        loadedCount++;
        if (loadedCount === totalImages) {
          setDoctorImages(newImages);
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        newImages[index] = null;
        console.error(`Failed to load image for ${doctor.name}`);
        loadedCount++;
        if (loadedCount === totalImages) {
          setDoctorImages(newImages);
          setImagesLoaded(true);
        }
      };
    });
  }, [doctorsData, doctorImages]);

  useEffect(() => {
    preloadImages();
  }, []);

  return { drawCard, imagesLoaded };
};
