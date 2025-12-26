"use client";

import * as React from "react";
import {
  FluentProvider,
  webDarkTheme,
  makeStyles,
  shorthands,
  tokens,
  Button,
  Text,
  Textarea,
  Caption1,
  Subtitle2,
} from "@fluentui/react-components";
import {
  MicRegular,
  SendRegular,
  DocumentRegular,
  MoreHorizontalRegular,
  SlideLayoutRegular,
  AttachRegular,
  DeleteRegular,
  StopRegular,
  AddRegular,
  SubtractRegular
} from "@fluentui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types for uploaded files
interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

// Types for slides
interface Slide {
  id: number;
  filename: string;
  content: string;
}

interface SlidesResponse {
  slides: Slide[];
  total: number;
}

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

// ----------------------------------------------------------------------------
// 1. 样式定义 (Styles)
// ----------------------------------------------------------------------------
const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  resizer: {
    width: "4px",
    backgroundColor: tokens.colorNeutralStroke2,
    cursor: "col-resize",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: tokens.colorBrandStroke1,
    },
  },
  resizerActive: {
    backgroundColor: tokens.colorBrandStroke1,
  },
  // 通用面板样式
  panel: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
  },
  
  // --- 左侧：AI 助手区域 ---
  leftPanelHeader: {
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceFilesArea: {
    padding: "0 16px 16px 16px",
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
  fileCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground3,
    padding: "8px",
    borderRadius: tokens.borderRadiusMedium,
    marginTop: "8px",
    gap: "8px",
    cursor: "pointer",
  },
  chatArea: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  chatBubbleAi: {
    alignSelf: "flex-start",
    backgroundColor: tokens.colorNeutralBackground3,
    padding: "10px",
    borderRadius: "12px 12px 12px 0",
    maxWidth: "85%",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: "10px",
    borderRadius: "12px 12px 0 12px",
    maxWidth: "85%",
  },
  inputArea: {
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderTop("1px", "solid", tokens.colorNeutralStroke1),
  },
  inputToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
    gap: "8px",
    flexWrap: "wrap",
    minHeight: "32px",
  },
  inputToolbarLeft: {
    flex: "1",
    minWidth: "0",
    overflow: "hidden",
  },
  inputToolbarRight: {
    display: "flex",
    gap: "8px",
    flexShrink: "0",
  },
  inputResizeHandle: {
    height: "4px",
    backgroundColor: tokens.colorNeutralStroke2,
    cursor: "ns-resize",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: tokens.colorBrandStroke1,
    },
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-2px",
      left: "0",
      right: "0",
      height: "8px",
    },
  },
  inputResizeHandleActive: {
    backgroundColor: tokens.colorBrandStroke1,
  },

  // --- 中间：PPT 导航 ---
  navHeader: {
    padding: "16px",
    textAlign: "center",
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
  },
  navScrollArea: {
    padding: "8px 12px", // 减少 padding
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px", // 减少间距
    maxHeight: "calc(100vh - 100px)", // 确保有足够空间滚动
    flex: 1, // 占用剩余空间
    position: "relative",
  },
  navScrollContainer: {
    position: "relative",
    flex: 1,
    width: "100%",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      height: "24px",
      background: `linear-gradient(to bottom, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground1}CC 50%, transparent 100%)`,
      zIndex: 10,
      pointerEvents: "none",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      height: "24px",
      background: `linear-gradient(to top, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground1}CC 50%, transparent 100%)`,
      zIndex: 10,
      pointerEvents: "none",
    },
  },
  thumbnailWrapper: {
    position: "relative",
    width: "100%",
    cursor: "pointer",
    transition: "transform 0.2s",
    ":hover": {
      transform: "scale(1.02)",
    },
  },
  thumbnail: {
    width: "100%",
    aspectRatio: "16/9",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    overflow: "hidden",
    position: "relative",
  },
  thumbnailIframe: {
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    transform: "scale(0.2)",
    transformOrigin: "top left",
    width: "500%",
    height: "500%",
    pointerEvents: "none",
  },
  thumbnailActive: {
    ...shorthands.border("2px", "solid", tokens.colorBrandStroke1),
    boxShadow: tokens.shadow16,
  },
  pageNumber: {
    position: "absolute",
    top: "4px",
    left: "4px",
    color: tokens.colorNeutralForeground3,
    fontSize: "10px",
  },

  // --- 右侧：预览区域 ---
  previewArea: {
    backgroundColor: tokens.colorNeutralBackground2, // 比背景稍亮或稍暗以突出画布
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    position: "relative",
  },
  canvas: {
    width: "100%",
    maxWidth: "1000px",
    aspectRatio: "16/9",
    backgroundColor: tokens.colorNeutralBackground1, // 画布是纯黑/纯白
    boxShadow: tokens.shadow64, // 高级感的阴影
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    flexDirection: "column",
    padding: "40px",
    position: "relative",
  },
  canvasContent: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    alignItems: "center",
    height: "100%",
  }
});

// ----------------------------------------------------------------------------
// 2. 组件实现
// ----------------------------------------------------------------------------

export default function SlideGenAI() {
  const styles = useStyles();
  const [selectedMode, setSelectedMode] = React.useState<string>("single");
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([
    {
      id: '1',
      name: 'Transcription Quality Improvement.doc',
      type: 'application/msword',
      size: 1024000
    }
  ]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [recognition, setRecognition] = React.useState<SpeechRecognition | null>(null);
  
  // Input area resizing state
  const [inputAreaHeight, setInputAreaHeight] = React.useState(120);
  const [isResizingInput, setIsResizingInput] = React.useState(false);
  
  // Slides state
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isLoadingSlides, setIsLoadingSlides] = React.useState(true);
  const [previewHtml, setPreviewHtml] = React.useState<string>('');
  const [zoom, setZoom] = React.useState(100);

  // Resizable panel state
  const [leftWidth, setLeftWidth] = React.useState(300);
  const [middleWidth, setMiddleWidth] = React.useState(180);
  const [isDragging, setIsDragging] = React.useState<'left' | 'right' | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Load slides from API
  React.useEffect(() => {
    const loadSlides = async () => {
      try {
        setIsLoadingSlides(true);
        const response = await fetch('/api/slides');
        if (response.ok) {
          const data: SlidesResponse = await response.json();
          setSlides(data.slides);
          if (data.slides.length > 0) {
            setCurrentSlideIndex(0);
            setPreviewHtml(data.slides[0].content);
          }
        } else {
          console.error('Failed to load slides');
        }
      } catch (error) {
        console.error('Error loading slides:', error);
      } finally {
        setIsLoadingSlides(false);
      }
    };

    loadSlides();
  }, []);

  // Handle slide selection
  const handleSlideSelect = (slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < slides.length) {
      setCurrentSlideIndex(slideIndex);
      setPreviewHtml(slides[slideIndex].content);
    }
  };

  // Handle zoom
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 10));

  // Handle resizing
  const handleMouseDown = (type: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  // Handle input area resize
  const handleInputResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingInput(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      if (isDragging) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;

        if (isDragging === 'left') {
          const newLeftWidth = Math.max(200, Math.min(mouseX, containerWidth * 0.6));
          setLeftWidth(newLeftWidth);
        } else if (isDragging === 'right') {
          const newMiddleWidth = Math.max(150, Math.min(mouseX - leftWidth, containerWidth * 0.4));
          setMiddleWidth(newMiddleWidth);
        }
      }

      if (isResizingInput) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const mouseY = e.clientY;
        const containerBottom = containerRect.bottom;
        const newHeight = Math.max(80, Math.min(300, containerBottom - mouseY));
        setInputAreaHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setIsResizingInput(false);
    };

    if (isDragging || isResizingInput) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      if (isDragging) {
        document.body.style.cursor = 'col-resize';
      } else if (isResizingInput) {
        document.body.style.cursor = 'ns-resize';
      }
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizingInput, leftWidth]);

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'zh-CN';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + ' ' + transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Handle file deletion
  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle attachment button click
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    if (!recognition) {
      alert('语音识别不被支持在此浏览器中');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <FluentProvider theme={webDarkTheme}>
      <div className={styles.container} ref={containerRef}>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        
        {/* === LEFT COLUMN: AI Assistant & Source Files === */}
        <div
          className={styles.panel}
          style={{ width: `${leftWidth}px`, minWidth: '200px', maxWidth: '60%' }}
        >
          
          {/* Header */}
          <div className={styles.leftPanelHeader}>
            <Subtitle2>AI Copilot</Subtitle2>
            <Button icon={<MoreHorizontalRegular />} appearance="subtle" />
          </div>

          {/* Source Files Area (Grounding) */}
          <div className={styles.sourceFilesArea}>
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>Source Context</Caption1>
            {uploadedFiles.map((file) => (
              <div key={file.id} className={styles.fileCard}>
                <DocumentRegular style={{ color: tokens.colorBrandForeground1 }} />
                <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Text truncate wrap={false} size={200} weight="medium">
                    {file.name}
                  </Text>
                </div>
                <Button
                  icon={<DeleteRegular />}
                  size="small"
                  appearance="subtle"
                  onClick={() => handleDeleteFile(file.id)}
                />
              </div>
            ))}
          </div>

          {/* Chat History */}
          <div className={styles.chatArea} style={{ flex: 1, minHeight: 0 }}>
            <div className={styles.chatBubbleUser}>
              <Text>Create a slide summarizing the document.</Text>
            </div>
            <div className={styles.chatBubbleAi}>
              <Text>I&apos;ve analyzed &quot;Transcription Quality Improvement.doc&quot;. Here is a summary slide covering the key metrics.</Text>
            </div>
          </div>

          {/* Input Area Resize Handle */}
          <div
            className={`${styles.inputResizeHandle} ${isResizingInput ? styles.inputResizeHandleActive : ''}`}
            onMouseDown={handleInputResizeStart}
          />

          {/* Input Area */}
          <div className={styles.inputArea} style={{ height: `${inputAreaHeight}px`, minHeight: '80px' }}>
            <Textarea
              placeholder="Ask AI to edit..."
              style={{
                width: '100%',
                height: `${inputAreaHeight - 60}px`,
                minHeight: '40px',
                resize: 'none'
              }}
              resize="none"
              value={inputValue}
              onChange={(_, data) => setInputValue(data.value)}
            />
            
            <div className={styles.inputToolbar}>
              {/* Edit Mode Toggle */}
              <div className={styles.inputToolbarLeft}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      appearance="subtle"
                      size="small"
                      style={{
                        minWidth: "120px",
                        justifyContent: "flex-start",
                        border: "none",
                        backgroundColor: "transparent"
                      }}
                    >
                      {selectedMode === "single" ? "Single Page" : "Global Gen"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="min-w-[120px]">
                    <DropdownMenuItem
                      onClick={() => setSelectedMode("single")}
                      className={selectedMode === "single" ? "bg-accent" : ""}
                    >
                      Single Page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedMode("global")}
                      className={selectedMode === "global" ? "bg-accent" : ""}
                    >
                      Global Gen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tools */}
              <div className={styles.inputToolbarRight}>
                <Button
                  icon={<AttachRegular />}
                  appearance="subtle"
                  onClick={handleAttachmentClick}
                />
                <Button
                  icon={isRecording ? <StopRegular /> : <MicRegular />}
                  appearance={isRecording ? "primary" : "subtle"}
                  onClick={handleVoiceRecording}
                />
                <Button icon={<SendRegular />} appearance="primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Left Resizer */}
        <div
          className={`${styles.resizer} ${isDragging === 'left' ? styles.resizerActive : ''}`}
          onMouseDown={handleMouseDown('left')}
        />

        {/* === MIDDLE COLUMN: Slide Navigator (Single Column) === */}
        <div
          className={styles.panel}
          style={{ width: `${middleWidth}px`, minWidth: '150px', maxWidth: '400px' }}
        >
          <div className={styles.navHeader}>
            <Caption1>{isLoadingSlides ? 'Loading...' : `${slides.length} Slides`}</Caption1>
          </div>
          <div className={styles.navScrollContainer}>
            <div className={styles.navScrollArea}>
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={styles.thumbnailWrapper}
                  onClick={() => handleSlideSelect(index)}
                >
                  <span className={styles.pageNumber}>{index + 1}</span>
                  <div
                    className={`${styles.thumbnail} ${index === currentSlideIndex ? styles.thumbnailActive : ''}`}
                  >
                    <iframe
                      srcDoc={slide.content}
                      className={styles.thumbnailIframe}
                      title={`Thumbnail ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Resizer */}
        <div
          className={`${styles.resizer} ${isDragging === 'right' ? styles.resizerActive : ''}`}
          onMouseDown={handleMouseDown('right')}
        />

        {/* === RIGHT COLUMN: Live Preview === */}
        <div className={styles.previewArea} style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}>
            <div className={styles.canvas} style={{ width: `${zoom}%`, maxWidth: 'none', flexShrink: 0 }}>
              {isLoadingSlides ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <SlideLayoutRegular fontSize={48} style={{ opacity: 0.5 }}/>
                  <Text>Loading slides...</Text>
                </div>
              ) : previewHtml ? (
                <iframe
                  srcDoc={previewHtml}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: tokens.borderRadiusMedium,
                  }}
                  title={`Slide ${currentSlideIndex + 1}`}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <SlideLayoutRegular fontSize={48} style={{ opacity: 0.5 }}/>
                  <Text>No slides available</Text>
                </div>
              )}
            </div>
          </div>

          {/* Floating Controls */}
          {slides.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: tokens.colorNeutralBackground1,
              padding: '8px 12px',
              borderRadius: tokens.borderRadiusMedium,
              boxShadow: tokens.shadow8,
              zIndex: 10
            }}>
              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Button icon={<SubtractRegular />} appearance="subtle" onClick={handleZoomOut} size="small" />
                <Text style={{ minWidth: '40px', textAlign: 'center' }}>{zoom}%</Text>
                <Button icon={<AddRegular />} appearance="subtle" onClick={handleZoomIn} size="small" />
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '16px', backgroundColor: tokens.colorNeutralStroke2 }} />

              {/* Page Info */}
              <Caption1>Page {currentSlideIndex + 1} of {slides.length}</Caption1>
            </div>
          )}
        </div>

      </div>
    </FluentProvider>
  );
}