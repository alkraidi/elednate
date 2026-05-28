import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Container, Heading, Label, Switch, Button, Text, toast } from '@medusajs/ui';
import { useEffect, useState } from 'react';

type HomepageConfig = {
  show_new_arrivals: boolean;
  show_category_tiles: boolean;
  show_high_end_collection: boolean;
  show_services: boolean;
};

const HomepageSectionsWidget = () => {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/admin/config/homepage', { credentials: 'include' }).then((r) => r.json()).then((d) => setConfig(d.config));
  }, []);

  if (!config) return null;

  function save() {
    setSaving(true);
    fetch('/admin/config/homepage', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).then((r) => r.json()).then(() => toast.success('Homepage sections updated')).finally(() => setSaving(false));
  }

  const ROWS: { key: keyof HomepageConfig; label: string; description: string }[] = [
    { key: 'show_new_arrivals', label: 'New Arrivals', description: '4-up grid of latest pieces.' },
    { key: 'show_category_tiles', label: 'Everyday / Special Occasions Tiles', description: 'Two large editorial category tiles.' },
    { key: 'show_high_end_collection', label: 'High End Collection', description: 'Masonry of statement pieces.' },
    { key: 'show_services', label: 'Services Row', description: '4 service icons: Returns, Gemologist, Shipping, Custom.' },
  ];

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h2">Homepage Sections</Heading>
          <Text className="text-ui-fg-subtle">Show or hide individual homepage sections.</Text>
        </div>
        <Button onClick={save} isLoading={saving}>Save</Button>
      </div>
      <div className="space-y-4">
        {ROWS.map((r) => (
          <div key={r.key} className="flex items-center justify-between border border-ui-border-base rounded-lg p-4">
            <div>
              <Label>{r.label}</Label>
              <Text size="small" className="text-ui-fg-subtle">{r.description}</Text>
            </div>
            <Switch checked={config[r.key]} onCheckedChange={(v) => setConfig({ ...config, [r.key]: v })} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({ zone: 'order.list.before' });
export default HomepageSectionsWidget;
