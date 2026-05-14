import { ExternalLink, Trash2 } from 'lucide-react';
import type { LinkItem } from '../hooks/useProjectStore';

function faviconFromDomain(domain: string) {
  const map: Record<string,string> = {
    'github.com': 'https://github.com/favicon.ico',
    'docs.google.com': 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_xl16.png',
    'kalshi.com': 'https://kalshi.com/favicon.ico',
    'linkedin.com': 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
    'youtube.com': 'https://www.youtube.com/s/desktop/0ac9412e/img/favicon.ico',
  };
  for (const k in map) if (domain.includes(k)) return map[k];
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

interface Props {
  link: LinkItem;
  onDelete: (id: string) => void;
}

export default function LinkPreview({ link, onDelete }: Props) {
  return (
    <div className="link-card">
      <img className="link-favicon" src={faviconFromDomain(link.domain)} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
      <div className="link-info">
        <a className="link-title" href={link.url} target="_blank" rel="noopener noreferrer">{link.title || link.domain}</a>
        <div className="link-domain">{link.domain}</div>
      </div>
      <div className="link-actions">
        <a className="link-open" href={link.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /></a>
        <button className="link-delete" onClick={() => onDelete(link.id)}><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
