import { useLocale } from './LocaleContext';

export function LocaleString(props) {
    const locale = useLocale();
    return locale.getLocaleString(props.entity);
}
