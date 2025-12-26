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
  TabList,
  Tab,
  Divider,
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
  DeleteRegular
} from "@fluentui/react-icons";

// ----------------------------------------------------------------------------
// 1. 样式定义 (Styles)
// ----------------------------------------------------------------------------
const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "300px 180px 1fr", // 左侧较窄，中间单栏，右侧自适应
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
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
  },

  // --- 中间：PPT 导航 ---
  navHeader: {
    padding: "16px",
    textAlign: "center",
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
  },
  navScrollArea: {
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
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
  const [selectedMode, setSelectedMode] = React.useState<unknown>("single");

  return (
    <FluentProvider theme={webDarkTheme}>
      <div className={styles.container}>
        
        {/* === LEFT COLUMN: AI Assistant & Source Files === */}
        <div className={styles.panel}>
          
          {/* Header */}
          <div className={styles.leftPanelHeader}>
            <Subtitle2>AI Copilot</Subtitle2>
            <Button icon={<MoreHorizontalRegular />} appearance="subtle" />
          </div>

          {/* Source Files Area (Grounding) */}
          <div className={styles.sourceFilesArea}>
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>Source Context</Caption1>
            <div className={styles.fileCard}>
              <DocumentRegular style={{ color: tokens.colorBrandForeground1 }} />
              <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                <Text truncate wrap={false} size={200} weight="medium">
                  Transcription Quality Improvement.doc
                </Text>
              </div>
              <Button icon={<DeleteRegular />} size="small" appearance="subtle" />
            </div>
          </div>

          <Divider />

          {/* Chat History */}
          <div className={styles.chatArea}>
            <div className={styles.chatBubbleUser}>
              <Text>Create a slide summarizing the document.</Text>
            </div>
            <div className={styles.chatBubbleAi}>
              <Text>I&apos;ve analyzed &quot;Transcription Quality Improvement.doc&quot;. Here is a summary slide covering the key metrics.</Text>
            </div>
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <Textarea 
              placeholder="Ask AI to edit..." 
              style={{ width: '100%', minHeight: '60px' }} 
              resize="vertical"
            />
            
            <div className={styles.inputToolbar}>
              {/* Edit Mode Toggle */}
              <TabList 
                selectedValue={selectedMode} 
                onTabSelect={(_, data) => setSelectedMode(data.value)}
                size="small"
              >
                <Tab value="single">Single Page</Tab>
                <Tab value="global">Global Gen</Tab>
              </TabList>

              {/* Tools */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button icon={<AttachRegular />} appearance="subtle" />
                <Button icon={<MicRegular />} appearance="subtle" />
                <Button icon={<SendRegular />} appearance="primary" />
              </div>
            </div>
          </div>
        </div>

        {/* === MIDDLE COLUMN: Slide Navigator (Single Column) === */}
        <div className={styles.panel} style={{ width: '180px' }}>
          <div className={styles.navHeader}>
            <Caption1>12 Slides</Caption1>
          </div>
          <div className={styles.navScrollArea}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.thumbnailWrapper}>
                <span className={styles.pageNumber}>{i}</span>
                <div 
                  className={`${styles.thumbnail} ${i === 3 ? styles.thumbnailActive : ''}`} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* === RIGHT COLUMN: Live Preview === */}
        <div className={styles.previewArea}>
          <div className={styles.canvas}>
            {/* Mock Slide Content */}
            <Text size={800} weight="bold">Quality Metrics Q3</Text>
            <Text size={400} style={{ color: tokens.colorNeutralForeground3 }}>Based on transcription analysis</Text>
            
            <div className={styles.canvasContent}>
               <div>
                  <Text as="p" block style={{ marginBottom: '10px' }}>
                    • Error rate decreased by 15%
                  </Text>
                  <Text as="p" block style={{ marginBottom: '10px' }}>
                    • User satisfaction up to 4.8/5
                  </Text>
                  <Text as="p" block>
                    • Latency reduced to 200ms
                  </Text>
               </div>
               {/* Mock Chart Area */}
               <div style={{ 
                 height: '100%', 
                 backgroundColor: tokens.colorNeutralBackground3, 
                 borderRadius: '8px',
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center' 
               }}>
                 <SlideLayoutRegular fontSize={48} style={{ opacity: 0.5 }}/>
               </div>
            </div>

            {/* Canvas Footer */}
            <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
               <Caption1>Page 3</Caption1>
            </div>
          </div>
        </div>

      </div>
    </FluentProvider>
  );
}