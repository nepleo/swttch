import { StaticItem } from '../../types';
import { i18n } from '@/i18n';
import { enKeyword } from '../../enKeyword';
import { SWITCH_MODEL_EVENT } from '@/pages/ChatPage/ModelSwitchOverlay';
import { useCliConfig } from '@/contexts/CliConfigContext';
import { useCurrentModel } from '@/hooks/useCurrentModel';
import { resolveModelInfo, resolveModelRowText } from '@/types/models';

const SwitchModelValue = () => {
  const { controlResponse } = useCliConfig();
  const currentModel = useCurrentModel();
  const models = controlResponse?.response?.response?.models ?? [];
  // Unidentified models show their raw value rather than "Default" (issue #217).
  const info = resolveModelInfo(models, currentModel, { allowDefaultFallback: false });
  // This item opens the model picker, so it names the current model the way
  // that picker's rows do — open it and the ticked row reads back the same
  // words. Notably that is NOT what the composer's chip shows: the chip names
  // the model running behind the `default` row, while the picker (and so this
  // item) names the row itself.
  const text = info ? resolveModelRowText(info).title : currentModel;
  return (
    <span className="text-[0.8461rem] text-text-secondary whitespace-nowrap">
      {text}
    </span>
  );
};

export const createSwitchModelItem = (): StaticItem =>
  new StaticItem('switch-model', i18n.t('commandPalette:model.switchModel'), {
    keywords: [enKeyword('commandPalette:model.switchModel'), 'model'],
    disabled: false,
    valueComponent: () => <SwitchModelValue />,
    action: async () => {
      window.dispatchEvent(new CustomEvent(SWITCH_MODEL_EVENT));
    },
  });
