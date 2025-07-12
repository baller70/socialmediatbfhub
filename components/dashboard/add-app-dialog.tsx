
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { App } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppAdded: (app: App) => void;
}

const CATEGORIES = [
  "Social Media",
  "Productivity",
  "Communication",
  "Entertainment",
  "News",
  "Work",
  "Shopping",
  "Education",
  "Finance",
  "Health",
  "Other"
];

const POPULAR_APPS = [
  { name: "Twitter", url: "https://twitter.com", icon: "🐦", category: "Social Media" },
  { name: "Instagram", url: "https://instagram.com", icon: "📷", category: "Social Media" },
  { name: "LinkedIn", url: "https://linkedin.com", icon: "💼", category: "Social Media" },
  { name: "Gmail", url: "https://mail.google.com", icon: "📧", category: "Communication" },
  { name: "Slack", url: "https://slack.com", icon: "💬", category: "Communication" },
  { name: "Notion", url: "https://notion.so", icon: "📝", category: "Productivity" },
  { name: "Trello", url: "https://trello.com", icon: "📋", category: "Productivity" },
  { name: "YouTube", url: "https://youtube.com", icon: "🎥", category: "Entertainment" },
  { name: "Netflix", url: "https://netflix.com", icon: "🎬", category: "Entertainment" },
  { name: "GitHub", url: "https://github.com", icon: "⚡", category: "Work" },
  { name: "WhatsApp Web", url: "https://web.whatsapp.com", icon: "💚", category: "Communication" },
  { name: "Discord", url: "https://discord.com", icon: "🎮", category: "Communication" },
];

export function AddAppDialog({ open, onOpenChange, onAppAdded }: AddAppDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    icon: "",
    category: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let url = formData.url.trim();
      
      // Add https:// if no protocol is specified
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const response = await fetch("/api/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          url,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add app");
      }

      const newApp = await response.json();
      onAppAdded(newApp);
      toast.success("App added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        url: "",
        icon: "",
        category: "",
        description: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add app");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (app: typeof POPULAR_APPS[0]) => {
    setFormData({
      name: app.name,
      url: app.url,
      icon: app.icon,
      category: app.category,
      description: `${app.name} - ${app.category}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New App</DialogTitle>
          <DialogDescription>
            Add a web application to your dashboard. You can embed any website that supports iframe embedding.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">App Name *</Label>
            <Input
              id="name"
              placeholder="Enter app name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                placeholder="🌐"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the app"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add App
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-6 pt-4 border-t border-border">
          <Label className="text-sm font-medium">Quick Add Popular Apps</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {POPULAR_APPS.slice(0, 6).map((app) => (
              <Button
                key={app.name}
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col items-center space-y-1"
                onClick={() => handleQuickAdd(app)}
                type="button"
              >
                <span className="text-lg">{app.icon}</span>
                <span className="text-xs">{app.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
