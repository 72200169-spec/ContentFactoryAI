export type ProjectStatus =
  | "idea"
  | "script_generating"
  | "script_ready"
  | "storyboard_generating"
  | "storyboard_ready"
  | "visuals_generating"
  | "visuals_ready"
  | "voice_generating"
  | "voice_ready"
  | "editing"
  | "video_ready"
  | "qa_review"
  | "qa_failed"
  | "qa_approved"
  | "human_review"
  | "ready_to_publish"
  | "error";

export type AssetType =
  | "image"
  | "audio"
  | "video"
  | "subtitle"
  | "thumbnail"
  | "music"
  | "sfx";

export type PipelineStage =
  | "script"
  | "storyboard"
  | "visuals"
  | "voice"
  | "subtitles"
  | "editing"
  | "qa"
  | "approval"
  | "publishing"
  | "analytics";

export type PipelineStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface Project {
  id: number;
  name: string;
  genre: string | null;
  language: string;
  target_duration: number | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: number;
  project_id: number;
  title: string;
  hook: string | null;
  story: string;
  ending: string | null;
  estimated_duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: number;
  story_id: number;
  scene_order: number;
  duration: number | null;
  visual_description: string | null;
  image_prompt: string | null;
  narration: string | null;
  transition: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: number;
  project_id: number;
  scene_id: number | null;
  type: AssetType;
  provider: string | null;
  path: string;
  metadata: string | null;
  created_at: string;
}

export interface PipelineRun {
  id: number;
  project_id: number;
  stage: PipelineStage;
  status: PipelineStatus;
  started_at: string;
  finished_at: string | null;
  error_code: string | null;
  error_message: string | null;
  metadata: string | null;
}

export interface QAReport {
  id: number;
  project_id: number;
  approved: boolean;
  score: number | null;
  problems: string | null;
  recommendations: string | null;
  created_at: string;
}

export interface CreateProjectInput {
  name: string;
  genre?: string;
  language?: string;
  target_duration?: number;
}

export interface CreateStoryInput {
  project_id: number;
  title: string;
  hook?: string;
  story: string;
  ending?: string;
  estimated_duration?: number;
}

export interface CreateSceneInput {
  story_id: number;
  scene_order: number;
  duration?: number;
  visual_description?: string;
  image_prompt?: string;
  narration?: string;
  transition?: string;
}
