import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Container, Heading, Label, Input, Switch, Button, Text, toast } from '@medusajs/ui';
import { useEffect, useState } from 'react';

type Announcement = { enabled: boolean; text: string; background_color: string; text_color: string };

const AnnouncementBarWidget = () => {
  const [config, setConfig] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/admin/config/announcement', { credentials: 'include' }).then((r) => r.json()).then((d) => setConfig(d.config));
  }, []);

  if (!config) return null;

  function save() {
    setSaving(true);
    fetch('/admin/config/announcement', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).then((r) => r.json()).then(() => toast.success('Announcement bar updated')).finally(() => setSaving(false));
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h2">Announcement Bar</Heading>
          <Text className="text-ui-fg-subtle">The thin bar at the very top of the storefront.</Text>
        </div>
        <Button onClick={save} isLoading={saving}>Save</Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enabled</Label>
          <Switch checked={config.enabled} onCheckedChange={(v) => setConfig({ ...config, enabled: v })} />
        </div>
        <div><Label>Text</Label><Input value={config.text} onChange={(e) => setConfig({ ...config, text: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Background colour</Label><Input value={config.background_color} onChange={(e) => setConfig({ ...config, background_color: e.target.value })} /></div>
          <div><Label>Text colour</Label><Input value={config.text_color} onChange={(e) => setConfig({ ...config, text_color: e.target.value })} /></div>
        </div>
        <div className="rounded p-3" style={{ backgroundColor: config.background_color, color: config.text_color }}>
          <Text size="small">{config.text}</Text>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({ zone: 'order.list.before' });
export default AnnouncementBarWidget;
