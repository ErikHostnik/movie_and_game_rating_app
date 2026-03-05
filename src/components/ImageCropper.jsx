import { useState, useRef, useEffect } from 'react';

const PREVIEW_W = 260;
const PREVIEW_H = 390;
const OUTPUT_W = 400;
const OUTPUT_H = 600;

const clampPos = (p, sc, ns) => {
  const imgW = ns.w * sc;
  const imgH = ns.h * sc;
  return {
    x: imgW >= PREVIEW_W
      ? Math.max(PREVIEW_W - imgW, Math.min(0, p.x))
      : (PREVIEW_W - imgW) / 2,
    y: imgH >= PREVIEW_H
      ? Math.max(PREVIEW_H - imgH, Math.min(0, p.y))
      : (PREVIEW_H - imgH) / 2,
  };
};

const ImageCropper = ({ src, onApply, onCancel }) => {
  const [naturalSize, setNaturalSize] = useState(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ns = { w: img.naturalWidth, h: img.naturalHeight };
      const initScale = Math.max(PREVIEW_W / ns.w, PREVIEW_H / ns.h);
      setNaturalSize(ns);
      setScale(initScale);
      setPos(
        clampPos(
          { x: (PREVIEW_W - ns.w * initScale) / 2, y: (PREVIEW_H - ns.h * initScale) / 2 },
          initScale,
          ns
        )
      );
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    if (!dragging || !naturalSize) return;

    const onMove = (e) => {
      const { startX, startY, startPosX, startPosY } = dragStartRef.current;
      setPos(
        clampPos(
          { x: startPosX + (e.clientX - startX), y: startPosY + (e.clientY - startY) },
          scale,
          naturalSize
        )
      );
    };
    const onUp = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, scale, naturalSize]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
    };
    setDragging(true);
  };

  const handleScaleChange = (e) => {
    if (!naturalSize) return;
    const newScale = Number(e.target.value);
    const cx = PREVIEW_W / 2;
    const cy = PREVIEW_H / 2;
    const imgX = (cx - pos.x) / scale;
    const imgY = (cy - pos.y) / scale;
    setScale(newScale);
    setPos(clampPos({ x: cx - imgX * newScale, y: cy - imgY * newScale }, newScale, naturalSize));
  };

  const handleApply = () => {
    if (!naturalSize) return;
    const canvas = canvasRef.current;
    canvas.width = OUTPUT_W;
    canvas.height = OUTPUT_H;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const srcX = -pos.x / scale;
      const srcY = -pos.y / scale;
      const srcW = PREVIEW_W / scale;
      const srcH = PREVIEW_H / scale;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_W, OUTPUT_H);
      onApply(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = src;
  };

  const minScale = naturalSize
    ? Math.max(PREVIEW_W / naturalSize.w, PREVIEW_H / naturalSize.h)
    : 1;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>Adjust Image</span>
          <span style={styles.hint}>Drag to reposition · Zoom with slider</span>
        </div>

        <div
          style={{ ...styles.preview, cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
        >
          {naturalSize ? (
            <img
              src={src}
              alt=""
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: naturalSize.w * scale,
                height: naturalSize.h * scale,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          ) : (
            <div style={styles.loading}>Loading...</div>
          )}

          {/* Rule of thirds grid */}
          <div style={{ ...styles.gridLine, top: '33.3%', width: '100%', height: '1px' }} />
          <div style={{ ...styles.gridLine, top: '66.6%', width: '100%', height: '1px' }} />
          <div style={{ ...styles.gridLine, left: '33.3%', width: '1px', height: '100%' }} />
          <div style={{ ...styles.gridLine, left: '66.6%', width: '1px', height: '100%' }} />
        </div>

        <div style={styles.controls}>
          <div style={styles.zoomRow}>
            <span style={styles.zoomLabel}>Zoom</span>
            <input
              type="range"
              min={minScale}
              max={minScale * 4}
              step={0.005}
              value={scale}
              onChange={handleScaleChange}
              className="completion-slider"
              style={{ flex: 1 }}
            />
            <span style={styles.zoomPct}>{Math.round((scale / minScale) * 100)}%</span>
          </div>

          <div style={styles.actions}>
            <button style={styles.applyBtn} onClick={handleApply}>
              Apply
            </button>
            <button style={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    background: '#1a1a2e',
    borderRadius: '16px',
    border: '1px solid #2a2a3a',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  title: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  hint: {
    color: '#555',
    fontSize: '0.82rem',
  },
  preview: {
    width: PREVIEW_W,
    height: PREVIEW_H,
    background: '#000',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    border: '2px solid #3a3a4a',
  },
  loading: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: '0.9rem',
  },
  gridLine: {
    position: 'absolute',
    background: 'rgba(255,255,255,0.18)',
    pointerEvents: 'none',
  },
  controls: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  zoomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  zoomLabel: {
    color: '#aaa',
    fontSize: '0.85rem',
    minWidth: '36px',
  },
  zoomPct: {
    color: '#aaa',
    fontSize: '0.85rem',
    minWidth: '42px',
    textAlign: 'right',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  applyBtn: {
    flex: 1,
    padding: '11px',
    background: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '11px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
};

export default ImageCropper;
