import { i18n } from '@/i18n';

// Claude Code 원판 스피너 동사(영어 그대로). 인터페이스 언어와 무관하게
// 항상 en 카탈로그를 쓴다 — 번역하면 말장난이 깨진다.
export function getVerbs(): readonly string[] {
    return i18n.t('chat:streamingIndicator.verbs', {
        returnObjects: true,
        lng: 'en',
    }) as string[];
}

// 아이콘 프레임 (ping-pong)
export const BASE_FRAMES = ["·", "✢", "*", "✶", "✻", "✽"] as const;
export const ICON_FRAMES = [...BASE_FRAMES, ...[...BASE_FRAMES].reverse()];

// 텍스트 변경 딜레이 스케줄 (ms)
export const TEXT_CHANGE_DELAYS = [2000, 3000, 5000];

// 스크램블 중간 문자 후보
export const SCRAMBLE_CHARS = [".", "_"];
