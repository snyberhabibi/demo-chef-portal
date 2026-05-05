"use client";

import React, { useState } from 'react';
import {
  ChevronRight, ChevronLeft, Save, Info, Plus,
  Trash2, CheckCircle2, UtensilsCrossed, Clock
} from 'lucide-react';
import { Button } from '@/components/polaris/button';
import { Input, Textarea, Label } from '@/components/polaris/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/polaris/select';
import { Card, CardDivider } from '@/components/polaris/card';
import { Badge } from '@/components/polaris/badge';

const YallaBitesForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [portions, setPortions] = useState([
    { id: 1, label: 'Standard', size: '250g', price: '12.00' }
  ]);

  const steps = [
    { id: 0, title: 'Dish Details', description: 'Basic info & pricing' },
    { id: 1, title: 'Media', description: 'Photos & gallery' },
    { id: 2, title: 'Specs & Portions', description: 'Sizes & dietary' },
    { id: 3, title: 'Customizations', description: 'Modifiers & add-ons' },
  ];

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r bg-white p-6 hidden lg:block">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xl tracking-tight">
            <UtensilsCrossed size={24} />
            <span>Yalla Bites</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Chef Portal</p>
        </div>

        <nav className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeStep === step.id
                ? 'bg-black text-white shadow-lg shadow-black/10'
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{step.title}</span>
                <span className={`text-[10px] ${activeStep === step.id ? 'text-slate-400' : 'text-slate-400'}`}>
                  {step.description}
                </span>
              </div>
              {activeStep > step.id && <CheckCircle2 size={16} className="text-green-500" />}
            </button>
          ))}
        </nav>

        <div className="mt-12 p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-2">
            <Info size={14} />
            <span>Optimization Tip</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-600/80">
            Dishes with at least 3 high-quality photos receive 2.4x more orders on average.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold">{steps[activeStep].title}</h2>
            <Badge tone="info">Draft</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="tertiary">Discard</Button>
            <Button variant="default" size="lg">
              <Save size={18} />
              Save Dish
            </Button>
          </div>
        </header>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
          {/* STEP 0: DETAILS */}
          {activeStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Card>
                <div className="grid grid-cols-1 gap-[var(--p-space-400)]">
                  <div>
                    <Label required>Dish Name</Label>
                    <Input type="text" placeholder="e.g. Traditional Shawarma Plate" />
                  </div>
                  <div>
                    <Label required>Description</Label>
                    <Textarea rows={4} placeholder="Describe the ingredients and flavors..." />
                  </div>
                </div>

                <CardDivider />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--p-space-400)]">
                  <div>
                    <Label>Cuisine</Label>
                    <Select defaultValue="palestinian">
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="palestinian">Palestinian</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select defaultValue="main">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Meals</SelectItem>
                        <SelectItem value="appetizers">Appetizers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Clock size={12} /> Lead Time
                    </Label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="2.5" />
                      <Select defaultValue="hrs">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hrs">Hrs</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-[var(--p-font-size-350)] leading-[var(--p-font-line-height-500)] font-[var(--p-font-weight-semibold)]">Badge Tones</h3>
                <div className="flex flex-wrap gap-[var(--p-space-200)]">
                  <Badge tone="default">Default</Badge>
                  <Badge tone="info">Info</Badge>
                  <Badge tone="success">Success</Badge>
                  <Badge tone="warning">Warning</Badge>
                  <Badge tone="critical">Critical</Badge>
                  <Badge tone="attention">Attention</Badge>
                  <Badge tone="new">New</Badge>
                  <Badge tone="magic">Magic</Badge>
                  <Badge tone="emphasis">Emphasis</Badge>
                  <Badge tone="read-only">Read-only</Badge>
                  <Badge tone="enabled">Enabled</Badge>
                </div>
                <CardDivider />
                <h3 className="text-[var(--p-font-size-350)] leading-[var(--p-font-line-height-500)] font-[var(--p-font-weight-semibold)]">Small Badges</h3>
                <div className="flex flex-wrap gap-[var(--p-space-200)]">
                  <Badge tone="default" size="sm">Default</Badge>
                  <Badge tone="info" size="sm">Info</Badge>
                  <Badge tone="success" size="sm">Success</Badge>
                  <Badge tone="warning" size="sm">Warning</Badge>
                  <Badge tone="critical" size="sm">Critical</Badge>
                  <Badge tone="attention" size="sm">Attention</Badge>
                  <Badge tone="new" size="sm">New</Badge>
                  <Badge tone="magic" size="sm">Magic</Badge>
                  <Badge tone="emphasis" size="sm">Emphasis</Badge>
                  <Badge tone="read-only" size="sm">Read-only</Badge>
                  <Badge tone="enabled" size="sm">Enabled</Badge>
                </div>
              </Card>
            </div>
          )}

          {/* STEP 2: PORTIONS (LISTS EXAMPLE) */}
          {activeStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[var(--p-font-size-350)] leading-[var(--p-font-line-height-500)] font-[var(--p-font-weight-semibold)]">Portion Sizes</h3>
                    <p className="text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">Add multiple sizes for this dish</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Plus size={14} /> Add Size
                  </Button>
                </div>

                {/* High Density List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-300)]">
                  {portions.map((p) => (
                    <div key={p.id} className="group flex items-center justify-between p-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)] border border-[var(--p-color-border-secondary)] rounded-[var(--p-border-radius-200)] hover:bg-[var(--p-color-bg-surface)] hover:border-[var(--p-color-border)] hover:shadow-[var(--p-shadow-200)]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--p-font-size-275)] font-[var(--p-font-weight-semibold)] uppercase tracking-widest text-[var(--p-color-text-secondary)]">{p.label}</span>
                          <Badge tone="success" size="sm">Active</Badge>
                        </div>
                        <p className="text-[var(--p-font-size-325)] font-[var(--p-font-weight-semibold)]">{p.size} • ${p.price}</p>
                      </div>
                      <button className="text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon-critical)]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-[var(--p-font-size-350)] leading-[var(--p-font-line-height-500)] font-[var(--p-font-weight-semibold)]">Dietary & Specs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Spice Level</Label>
                    <div className="flex gap-2">
                      {['None', 'Mild', 'Hot'].map(level => (
                        <Button key={level} variant="secondary" className="flex-1">{level}</Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Allergens</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allergens..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gluten">Gluten</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="nuts">Nuts</SelectItem>
                        <SelectItem value="shellfish">Shellfish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Action Navigation */}
        <footer className="h-24 bg-white border-t p-8 flex items-center justify-between mt-auto">
          <Button
            variant="tertiary"
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            <ChevronLeft size={18} />
            Back
          </Button>

          <div className="flex gap-2">
            {steps.map((s) => (
              <div key={s.id} className={`h-1.5 w-8 rounded-full transition-all ${activeStep === s.id ? 'bg-black w-12' : 'bg-slate-100'}`} />
            ))}
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={nextStep}
          >
            {activeStep === steps.length - 1 ? 'Review Dish' : 'Continue'}
            <ChevronRight size={18} />
          </Button>
        </footer>
      </main>
    </div>
  );
};

export default YallaBitesForm;
