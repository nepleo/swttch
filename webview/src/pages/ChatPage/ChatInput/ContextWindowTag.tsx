import Tippy from '@tippyjs/react/headless';
import { Tag } from '@/pages/ChatPage/ChatInput/Tag';
import { useChatStreamContext } from '@/contexts/ChatStreamContext';
import { calculateContextWindowPercent, formatContextCapacity } from '@/utils/contextWindow';
import { useTranslation } from '@/i18n';

interface Props {
  onClick?: () => void;
  disabled?: boolean;
}

export function ContextWindowTag(props: Props) {
  const { onClick, disabled = false } = props;
  const { t } = useTranslation('chat');
  const { contextWindowUsage } = useChatStreamContext();

  // Startup / empty session: no CLI usage yet → still show 0%. The tag used to
  // hide entirely while contextWindowUsage was null, which looked like a bug.
  const totalTokens = contextWindowUsage?.totalTokens ?? 0;
  const contextWindow = contextWindowUsage?.contextWindow ?? 0;
  const maxOutputTokens = contextWindowUsage?.maxOutputTokens ?? 0;

  const percent = contextWindow > 0
    ? calculateContextWindowPercent(totalTokens, contextWindow, maxOutputTokens)
    : 0;
  const remaining = 100 - percent;
  const isClickable = !disabled && contextWindow > 0 && percent >= 10;
  const maxContext = contextWindow > 0 ? formatContextCapacity(contextWindow) : null;

  return (
    <Tippy
      placement="top"
      render={(attrs) => (
        <div
          className="bg-surface-overlay border border-border-default rounded-md px-3 py-2 text-xs text-text-primary shadow-lg max-w-[240px]"
          {...attrs}
        >
          <p>{t('chatInput.contextWindow.remaining', { percent: remaining })}</p>
          <p className="text-text-secondary mt-1 text-[0.7692rem]">
            {t('chatInput.contextWindow.tokensUsed', { tokens: totalTokens.toLocaleString() })}
          </p>
          {maxContext && (
            <p className="text-text-secondary mt-1 text-[0.7692rem]">
              {t('chatInput.contextWindow.maxContext', { size: maxContext })}
            </p>
          )}
        </div>
      )}
    >
      <div className="flex items-center">
        <Tag onClick={isClickable ? onClick : undefined} disabled={!isClickable}>
          <span>{t('chatInput.contextWindow.used', { percent })}</span>
        </Tag>
      </div>
    </Tippy>
  );
}
