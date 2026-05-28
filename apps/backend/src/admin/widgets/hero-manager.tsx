import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Container, Heading, Label, Input, Switch, Button, Select, Textarea, Text, toast } from '@medusajs/ui';
import { useEffect, useState } from 'react';

type Slide = { id: string; image_url: string; title: string; subtitle: string; cta_text: string; cta_link: string };
type HeroConfig = {
  id?: string;
  mode: 'slideshow' | 'video';
  slideshow_interval_seconds: number;
  video_url: string | null;
  slides: Slide[];
};

const HeroManagerWidget = () => {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/admin/config/hero', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setConfig(d.config));
  }, []);

  if (!config) return null;

  function save() {
    setSaving(true);
    fetch('/admin/config/hero', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
      .then((r) => r.json())
      .then(() => toast.success('Hero updated', { description: 'Live on the storefront.' }))
      .catch(() => toast.error('Save failed'))
      .finally(() => setSaving(false));
  }

  function updateSlide(idx: number, patch: Partial<Slide>) {
    setConfig({ ...config!, slides: config!.slides.map((s, i) => (i === idx ? { ...s, ...patch } : s)) });
  }
  function addSlide() {
    setConfig({
      ...config!,
      slides: [
        ...config!.slides,
        { id: `slide_${Date.now()}`, image_url: '', title: '', subtitle: '', cta_text: 'Shop Now', cta_link: '/shop' },
      ],
    });
  }
  function removeSlide(idx: number) {
    setConfig({ ...config!, slides: config!.slides.filter((_, i) => i !== idx) });
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Heading level="h2">Hero Section</Heading>
          <Text className="text-ui-fg-subtle">Configure the storefront hero — slideshow or video.</Text>
        </div>
        <Button onClick={save} isLoading={saving}>Save</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Mode</Label>
          <Select value={config.mode} onValueChange={(v) => setConfig({ ...config, mode: v as any })}>
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="slideshow">Slideshow</Select.Item>
              <Select.Item value="video">Video</Select.Item>
            </Select.Content>
          </Select>
        </div>
        {config.mode === 'slideshow' ? (
          <div>
            <Label>Seconds per slide</Label>
            <Input type="number" min={2} max={30} value={config.slideshow_interval_seconds} onChange={(e) => setConfig({ ...config, slideshow_interval_seconds: Number(e.target.value) })} />
          </div>
        ) : (
          <div>
            <Label>Video URL (YouTube, Vimeo, or .mp4)</Label>
            <Input value={config.video_url ?? ''} onChange={(e) => setConfig({ ...config, video_url: e.target.value })} />
          </div>
        )}
      </div>

      {config.mode === 'slideshow' && (
        <div className="space-y-4">
          {config.slides.map((s, idx) => (
            <div key={s.id} className="border border-ui-border-base rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Heading level="h3" className="text-base">Slide {idx + 1}</Heading>
                <Button variant="transparent" onClick={() => removeSlide(idx)}>Remove</Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Image URL</Label><Input value={s.image_url} onChange={(e) => updateSlide(idx, { image_url: e.target.value })} /></div>
                <div><Label>Title</Label><Input value={s.title} onChange={(e) => updateSlide(idx, { title: e.target.value })} /></div>
                <div><Label>Subtitle</Label><Input value={s.subtitle} onChange={(e) => updateSlide(idx, { subtitle: e.target.value })} /></div>
                <div><Label>CTA Text</Label><Input value={s.cta_text} onChange={(e) => updateSlide(idx, { cta_text: e.target.value })} /></div>
                <div><Label>CTA Link</Label><Input value={s.cta_link} onChange={(e) => updateSlide(idx, { cta_link: e.target.value })} /></div>
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={addSlide}>+ Add Slide</Button>
        </div>
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({ zone: 'order.list.before' });
export default HeroManagerWidget;
