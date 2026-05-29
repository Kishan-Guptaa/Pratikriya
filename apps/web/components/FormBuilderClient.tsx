"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Pencil, Plus, Trash2, GripVertical, X, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useCreateField,
  useDeleteField,
  useGetNextIndex,
  useListFieldsByFormId,
  useUpdateField,
  useReorderFields,
} from '~/hooks/api/form-field';

type Props = { formId: string };

type FieldType = 'TEXT' | 'NUMBER' | 'EMAIL' | 'YES_NO' | 'PASSWORD' | 'PDF' | 'IMAGE' | 'MULTIPLE_IMAGES' | 'TEXTAREA' | 'PHONE' | 'DROPDOWN' | 'CHECKBOX' | 'RADIO' | 'DATE' | 'RATING' | 'SIGNATURE' | 'ADDRESS' | 'TERMS';

function toLabelKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function FormBuilderClient({ formId }: Props) {
  const { index: nextIndex } = useGetNextIndex(formId);
  const { fields, isLoading: fieldsLoading } = useListFieldsByFormId(formId);
  const { createFieldAsync, isPending: creating } = useCreateField();
  const { updateFieldAsync } = useUpdateField();
  const { deleteFieldAsync, isPending: deleting } = useDeleteField();
  const { reorderFieldsAsync } = useReorderFields();

  const [orderedFields, setOrderedFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  useEffect(() => {
    if (fields) {
      setOrderedFields(fields);
    }
  }, [fields]);

  const selectedField = useMemo(() => {
    return orderedFields.find((f) => f.id === selectedFieldId);
  }, [orderedFields, selectedFieldId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedFields.findIndex((f) => f.id === active.id);
      const newIndex = orderedFields.findIndex((f) => f.id === over.id);

      const newOrdered = arrayMove(orderedFields, oldIndex, newIndex);
      setOrderedFields(newOrdered);

      try {
        await reorderFieldsAsync({
          formId,
          fieldIds: newOrdered.map((f) => f.id),
        });
      } catch (err) {
        console.error('Failed to reorder fields:', err);
        setOrderedFields(fields || []);
      }
    }
  }

  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('Full Name');
  const [description, setDescription] = useState('');
  const [placeholder, setPlaceholder] = useState('e.g. Enter your name');
  const [type, setType] = useState<FieldType>('TEXT');
  const [required, setRequired] = useState(false);

  const labelKey = useMemo(() => toLabelKey(label), [label]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formId || !label.trim()) return;

    const indexValue = Number(nextIndex ?? '1.00');

    const initialConfig = (() => {
      switch (type) {
        case 'CHECKBOX':
          return { options: ['JavaScript', 'React', 'Node.js', 'MongoDB'] };
        case 'RADIO':
          return { options: ['Male', 'Female', 'Other'] };
        case 'DROPDOWN':
          return { options: ['India', 'USA', 'Canada'] };
        case 'RATING':
          return { maxStars: 5, defaultRating: 0 };
        case 'ADDRESS':
          return { shownFields: { street: true, city: true, state: true, country: true, zip: true } };
        case 'TERMS':
          return { termsText: 'I agree to the Terms & Conditions and Privacy Policy.' };
        case 'SIGNATURE':
          return { height: 120 };
        default:
          return {};
      }
    })();

    const isCustomWidget = ['CHECKBOX', 'RADIO', 'DROPDOWN', 'RATING', 'SIGNATURE', 'ADDRESS', 'TERMS'].includes(type);
    const finalPlaceholder = isCustomWidget ? null : (placeholder.trim() || null);

    try {
      const res = await createFieldAsync({
        label: label.trim(),
        labelKey: labelKey || 'field',
        description: description.trim() || null,
        placeholder: finalPlaceholder,
        isRequired: required,
        index: Number.isFinite(indexValue) ? indexValue : 1,
        type,
        formId,
        configuration: JSON.stringify(initialConfig),
      } as any);

      setOpen(false);
      setLabel('Full Name');
      setDescription('');
      setPlaceholder('e.g. Enter your name');
      setType('TEXT');
      setRequired(false);

      // Automatically select the newly created field to open the configuration panel
      setSelectedFieldId(res.id);
      toast.success("Field added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add field");
    }
  }

  const handleConfigChange = async (fieldId: string, updates: Partial<any>) => {
    setOrderedFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId) {
          return { ...f, ...updates };
        }
        return f;
      })
    );

    try {
      await updateFieldAsync({
        id: fieldId,
        ...updates,
      } as any);
    } catch (err) {
      console.error('Failed to save configuration update:', err);
    }
  };

  const getFieldConfig = (field: any) => {
    try {
      return field.configuration ? JSON.parse(field.configuration) : {};
    } catch {
      return {};
    }
  };

  const handleFieldPropertyChange = (field: any, key: string, value: any) => {
    if (key === 'label' || key === 'placeholder' || key === 'description' || key === 'isRequired') {
      handleConfigChange(field.id, { [key]: value });
    } else {
      const config = getFieldConfig(field);
      const updatedConfig = { ...config, [key]: value };
      handleConfigChange(field.id, { configuration: JSON.stringify(updatedConfig) });
    }
  };

  async function handleDuplicate(field: any) {
    const idxVal = Number(field.index) + 0.01;
    try {
      const res = await createFieldAsync({
        label: `${field.label} Copy`,
        labelKey: `${toLabelKey(field.label)}_copy`,
        description: field.description,
        placeholder: field.placeholder,
        isRequired: field.isRequired,
        index: idxVal,
        type: field.type,
        formId: field.formId,
        configuration: field.configuration,
      } as any);

      // Select duplicated copy
      setSelectedFieldId(res.id);
      toast.success("Field duplicated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate field");
    }
  }

  async function handleDelete(fieldId: string) {
    try {
      await deleteFieldAsync({ id: fieldId } as any);
      toast.success("Field deleted");
      if (selectedFieldId === fieldId) {
        setSelectedFieldId(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete field");
    }
  }

  return (
    <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start relative">
      {/* CANVAS PREVIEW PANEL */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#1b1626] border-2 border-foreground p-4 rounded-2xl shadow-[3px_3px_0px_#000]">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white font-patrick-hand">Form Designer Canvas</p>
            <p className="text-xs text-muted-foreground">Select any card below to configure options dynamically.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 border-2 border-[#2d2638] rounded-xl font-bold bg-[#7b61ff] text-white shadow-[3px_3px_0px_#2d2638] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#2d2638] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2d2638] transition-all cursor-pointer">
                <Plus className="size-4" />
                Add field
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl border-2 border-[#2d2638] rounded-2xl shadow-[6px_6px_0px_#2d2638] bg-[#fbfaf5] dark:bg-[#1b1626] p-4 sm:p-5">
              <DialogHeader className="text-left border-b-2 border-dashed border-[#2d2638]/20 pb-2">
                <DialogTitle className="font-caveat text-2xl font-extrabold text-[#2d2638] dark:text-white">Add field</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="mt-3 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2d2638] dark:text-white">Label</label>
                  <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Full Name"
                    className="border-2 border-[#2d2638] rounded-xl h-9 px-3 py-1.5 focus:outline-none focus-visible:ring-0 focus-visible:border-[#7b61ff] bg-white dark:bg-[#130f1d] shadow-[2px_2px_0px_#2d2638] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2d2638] dark:text-white">Type</label>
                  <Select value={type} onValueChange={(value) => setType(value as FieldType)}>
                    <SelectTrigger className="w-full border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#130f1d] shadow-[2px_2px_0px_#2d2638] focus:ring-0 focus:border-[#7b61ff] h-9 text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#1b1626]">
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="TEXTAREA">Text Area</SelectItem>
                      <SelectItem value="NUMBER">Number</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="PHONE">Phone Number</SelectItem>
                      <SelectItem value="YES_NO">Yes / No</SelectItem>
                      <SelectItem value="PASSWORD">Password</SelectItem>
                      <SelectItem value="PDF">PDF Support</SelectItem>
                      <SelectItem value="IMAGE">Image Support (Single)</SelectItem>
                      <SelectItem value="MULTIPLE_IMAGES">Multiple Images (Max 4)</SelectItem>
                      <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                      <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                      <SelectItem value="RADIO">Radio Button</SelectItem>
                      <SelectItem value="DATE">Date Picker</SelectItem>
                      <SelectItem value="RATING">Star Rating</SelectItem>
                      <SelectItem value="SIGNATURE">Signature Pad</SelectItem>
                      <SelectItem value="ADDRESS">Address</SelectItem>
                      <SelectItem value="TERMS">Terms & Conditions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2d2638] dark:text-white">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Helper text shown below the field (optional)"
                    className="border-2 border-[#2d2638] rounded-xl p-2.5 focus:outline-none focus-visible:ring-0 focus-visible:border-[#7b61ff] bg-white dark:bg-[#130f1d] shadow-[2px_2px_0px_#2d2638] text-sm min-h-[60px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2d2638] dark:text-white">Placeholder</label>
                  <Input
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    placeholder="e.g. Enter your name"
                    className="border-2 border-[#2d2638] rounded-xl h-9 px-3 py-1.5 focus:outline-none focus-visible:ring-0 focus-visible:border-[#7b61ff] bg-white dark:bg-[#130f1d] shadow-[2px_2px_0px_#2d2638] text-sm"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-xs font-bold text-[#2d2638] dark:text-white cursor-pointer select-none">
                  <Checkbox
                    checked={required}
                    onCheckedChange={(value) => setRequired(value === true)}
                    className="border-2 border-[#2d2638] rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-4.5 shadow-[1px_1px_0px_#2d2638]"
                  />
                  Required field
                </label>

                <DialogFooter className="pt-1 gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="border-2 border-[#2d2638] h-9 px-4 rounded-xl font-bold shadow-[2px_2px_0px_#2d2638] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#2d2638] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2d2638] bg-white dark:bg-[#1b1626] text-[#2d2638] dark:text-white transition-all cursor-pointer text-xs"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={creating || !label.trim()}
                    className="bg-[#7b61ff] text-white border-2 border-[#2d2638] h-9 px-4 rounded-xl font-bold shadow-[2px_2px_0px_#2d2638] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#2d2638] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2d2638] hover:bg-[#7b61ff]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                  >
                    {creating ? 'Adding...' : 'Add Field'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="mt-4 space-y-3">
            {fieldsLoading ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                Loading fields...
              </div>
            ) : orderedFields.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No fields yet. Click <span className="font-medium text-foreground">Add field</span>.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedFields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {orderedFields.map((field) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        isSelected={selectedFieldId === field.id}
                        onClick={() => setSelectedFieldId(field.id)}
                        handleDelete={handleDelete}
                        deleting={deleting}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* DYNAMIC SIDEBAR CONFIGURATION PANEL */}
      {selectedField && (
        <div className="w-full lg:w-96 border-2 border-[#2d2638] rounded-2xl bg-[#fdfbf7] dark:bg-[#1b1626] p-5 shadow-[4px_4px_0px_#2d2638] lg:sticky lg:top-20 max-h-[85vh] overflow-y-auto shrink-0 transition-all">
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#2d2638]/20 pb-3 mb-4">
            <div className="space-y-0.5">
              <h3 className="font-caveat text-2xl font-black text-slate-800 dark:text-white">Field Settings</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-black">Type: {selectedField.type}</p>
            </div>
            <button
              onClick={() => setSelectedFieldId(null)}
              className="border-2 border-[#2d2638] rounded-lg p-1 bg-white hover:bg-slate-50 transition-all shadow-[1.5px_1.5px_0px_#2d2638] cursor-pointer"
            >
              <X className="size-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-5">
            {/* 1. Label */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-white">Field Label</label>
              <Input
                value={selectedField.label ?? ''}
                onChange={(e) => handleFieldPropertyChange(selectedField, 'label', e.target.value)}
                className="border-2 border-[#2d2638] rounded-xl p-2.5 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-sm"
              />
            </div>

            {/* 2. Placeholder */}
            {selectedField.type !== 'RATING' && selectedField.type !== 'SIGNATURE' && selectedField.type !== 'ADDRESS' && selectedField.type !== 'TERMS' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-white">Placeholder</label>
                <Input
                  value={selectedField.placeholder ?? ''}
                  onChange={(e) => handleFieldPropertyChange(selectedField, 'placeholder', e.target.value)}
                  className="border-2 border-[#2d2638] rounded-xl p-2.5 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-sm"
                />
              </div>
            )}

            {/* 3. Description / Help Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-white">Field Description / Help Text</label>
              <Textarea
                value={selectedField.description ?? ''}
                onChange={(e) => handleFieldPropertyChange(selectedField, 'description', e.target.value)}
                className="border-2 border-[#2d2638] rounded-xl p-2.5 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-sm min-h-[60px]"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-dashed border-[#2d2638]/10">
              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-white cursor-pointer select-none">
                <Checkbox
                  checked={!!selectedField.isRequired}
                  onCheckedChange={(val) => handleFieldPropertyChange(selectedField, 'isRequired', val === true)}
                  className="border-2 border-[#2d2638] rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-4.5 shadow-[1px_1px_0px_#2d2638]"
                />
                Required Field
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-white cursor-pointer select-none">
                <Checkbox
                  checked={!!getFieldConfig(selectedField).hidden}
                  onCheckedChange={(val) => handleFieldPropertyChange(selectedField, 'hidden', val === true)}
                  className="border-2 border-[#2d2638] rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-4.5 shadow-[1px_1px_0px_#2d2638]"
                />
                Hidden Field
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-white cursor-pointer select-none">
                <Checkbox
                  checked={!!getFieldConfig(selectedField).readOnly}
                  onCheckedChange={(val) => handleFieldPropertyChange(selectedField, 'readOnly', val === true)}
                  className="border-2 border-[#2d2638] rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-4.5 shadow-[1px_1px_0px_#2d2638]"
                />
                Read Only
              </label>
            </div>

            {/* Unique ID & Custom CSS */}
            <div className="space-y-3 pt-3 border-t border-dashed border-[#2d2638]/10">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Unique Field ID (label key)</label>
                <Input
                  value={selectedField.labelKey ?? ''}
                  disabled
                  className="border-2 border-slate-300 rounded-xl p-2.5 bg-slate-100 text-slate-500 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-white">Custom CSS Class</label>
                <Input
                  value={getFieldConfig(selectedField).cssClass ?? ''}
                  onChange={(e) => handleFieldPropertyChange(selectedField, 'cssClass', e.target.value)}
                  className="border-2 border-[#2d2638] rounded-xl p-2.5 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs font-mono"
                />
              </div>
            </div>

            {/* Conditional Logic */}
            <div className="space-y-3 pt-3 border-t border-dashed border-[#2d2638]/10">
              <h4 className="text-xs font-bold text-slate-700 dark:text-white">Conditional Logic</h4>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Show If Field</label>
                <Select
                  value={getFieldConfig(selectedField).conditionalLogic?.showIfField || 'none'}
                  onValueChange={(val) => {
                    const cond = { ...getFieldConfig(selectedField).conditionalLogic, showIfField: val === 'none' ? '' : val };
                    handleFieldPropertyChange(selectedField, 'conditionalLogic', cond);
                  }}
                >
                  <SelectTrigger className="w-full border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#130f1d] shadow-[1.5px_1.5px_0px_#2d2638] h-9 text-xs">
                    <SelectValue placeholder="Select field..." />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#1b1626]">
                    <SelectItem value="none">-- Disable Logic --</SelectItem>
                    {orderedFields
                      .filter((f) => f.id !== selectedField.id)
                      .map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.label} ({f.type})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {getFieldConfig(selectedField).conditionalLogic?.showIfField && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Trigger Value Equals</label>
                  <Input
                    value={getFieldConfig(selectedField).conditionalLogic?.showIfValue ?? ''}
                    onChange={(e) => {
                      const cond = { ...getFieldConfig(selectedField).conditionalLogic, showIfValue: e.target.value };
                      handleFieldPropertyChange(selectedField, 'conditionalLogic', cond);
                    }}
                    placeholder="Value to trigger visibility"
                    className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                  />
                </div>
              )}
            </div>

            {/* Field-Specific Configuration Options */}
            <div className="space-y-3 pt-3 border-t border-dashed border-[#2d2638]/10">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Field-specific Config</h4>

              {selectedField.type === 'TEXT' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Min Length</label>
                      <Input
                        type="number"
                        value={getFieldConfig(selectedField).minLength ?? ''}
                        onChange={(e) => handleFieldPropertyChange(selectedField, 'minLength', e.target.value)}
                        className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Max Length</label>
                      <Input
                        type="number"
                        value={getFieldConfig(selectedField).maxLength ?? ''}
                        onChange={(e) => handleFieldPropertyChange(selectedField, 'maxLength', e.target.value)}
                        className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Default Value</label>
                    <Input
                      type="text"
                      value={getFieldConfig(selectedField).defaultValue ?? ''}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'defaultValue', e.target.value)}
                      placeholder="e.g. John Doe"
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedField.type === 'TEXTAREA' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Rows</label>
                    <Input
                      type="number"
                      value={getFieldConfig(selectedField).rows ?? '4'}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'rows', e.target.value)}
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Char Limit</label>
                    <Input
                      type="number"
                      value={getFieldConfig(selectedField).charLimit ?? ''}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'charLimit', e.target.value)}
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedField.type === 'PHONE' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Default Country Code</label>
                  <Select
                    value={getFieldConfig(selectedField).countryCode ?? '+91'}
                    onValueChange={(val) => handleFieldPropertyChange(selectedField, 'countryCode', val)}
                  >
                    <SelectTrigger className="w-full border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#130f1d] shadow-[1.5px_1.5px_0px_#2d2638] h-9 text-xs">
                      <SelectValue placeholder="Country Code" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#1b1626]">
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      <SelectItem value="+1">+1 (USA)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+81">+81 (Japan)</SelectItem>
                      <SelectItem value="+61">+61 (Australia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(selectedField.type === 'DROPDOWN' || selectedField.type === 'RADIO' || selectedField.type === 'CHECKBOX') && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-white">Options Manager</label>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {(getFieldConfig(selectedField).options || (
                      selectedField.type === 'CHECKBOX' ? ['JavaScript', 'React', 'Node.js', 'MongoDB'] :
                      selectedField.type === 'RADIO' ? ['Male', 'Female', 'Other'] :
                      ['India', 'USA', 'Canada']
                    )).map((opt: string, idx: number, arr: string[]) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...arr];
                            newOpts[idx] = e.target.value;
                            handleFieldPropertyChange(selectedField, 'options', newOpts);
                          }}
                          className="border-2 border-[#2d2638] rounded-lg p-1 bg-white dark:bg-[#130f1d] text-xs h-8 shadow-[1px_1px_0px_#2d2638] flex-1 min-w-0"
                        />
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const newOpts = [...arr];
                            const temp = newOpts[idx]!;
                            newOpts[idx] = newOpts[idx - 1]!;
                            newOpts[idx - 1] = temp;
                            handleFieldPropertyChange(selectedField, 'options', newOpts);
                          }}
                          className="border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg p-1 bg-white hover:bg-slate-50 transition-all h-8 w-8 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#000] shrink-0"
                        >
                          <ArrowUp className="size-3 text-slate-600" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === arr.length - 1}
                          onClick={() => {
                            const newOpts = [...arr];
                            const temp = newOpts[idx]!;
                            newOpts[idx] = newOpts[idx + 1]!;
                            newOpts[idx + 1] = temp;
                            handleFieldPropertyChange(selectedField, 'options', newOpts);
                          }}
                          className="border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg p-1 bg-white hover:bg-slate-50 transition-all h-8 w-8 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#000] shrink-0"
                        >
                          <ArrowDown className="size-3 text-slate-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = arr.filter((_, i) => i !== idx);
                            handleFieldPropertyChange(selectedField, 'options', newOpts);
                          }}
                          className="border-2 border-foreground bg-rose-100 hover:bg-rose-200 rounded-lg p-1 transition-all h-8 w-8 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#000] shrink-0"
                        >
                          <Trash2 className="size-3.5 text-rose-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const arr = getFieldConfig(selectedField).options || (
                        selectedField.type === 'CHECKBOX' ? ['JavaScript', 'React', 'Node.js', 'MongoDB'] :
                        selectedField.type === 'RADIO' ? ['Male', 'Female', 'Other'] :
                        ['India', 'USA', 'Canada']
                      );
                      handleFieldPropertyChange(selectedField, 'options', [...arr, `New Option ${arr.length + 1}`]);
                    }}
                    className="w-full border-2 border-dashed border-foreground bg-white text-slate-800 hover:bg-slate-50 font-bold rounded-xl h-8 text-xs cursor-pointer shadow-[1px_1px_0px_#000]"
                  >
                    + Add Option
                  </Button>

                  {(selectedField.type === 'DROPDOWN' || selectedField.type === 'RADIO') && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Default Option</label>
                      <Select
                        value={getFieldConfig(selectedField).defaultOption ?? 'none'}
                        onValueChange={(val) => handleFieldPropertyChange(selectedField, 'defaultOption', val === 'none' ? '' : val)}
                      >
                        <SelectTrigger className="w-full border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#130f1d] shadow-[1.5px_1.5px_0px_#2d2638] h-9 text-xs">
                          <SelectValue placeholder="No default" />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#1b1626]">
                          <SelectItem value="none">-- No Default --</SelectItem>
                          {(getFieldConfig(selectedField).options || (
                            selectedField.type === 'RADIO' ? ['Male', 'Female', 'Other'] : ['India', 'USA', 'Canada']
                          )).map((opt: string, idx: number) => (
                            <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {selectedField.type === 'DATE' && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Min Date</label>
                    <Input
                      type="date"
                      value={getFieldConfig(selectedField).minDate ?? ''}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'minDate', e.target.value)}
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Max Date</label>
                    <Input
                      type="date"
                      value={getFieldConfig(selectedField).maxDate ?? ''}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'maxDate', e.target.value)}
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedField.type === 'RATING' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Max Stars</label>
                    <Select
                      value={String(getFieldConfig(selectedField).maxStars ?? '5')}
                      onValueChange={(val) => {
                        handleFieldPropertyChange(selectedField, 'maxStars', Number(val));
                        const curDef = getFieldConfig(selectedField).defaultRating || 0;
                        if (curDef > Number(val)) {
                          handleFieldPropertyChange(selectedField, 'defaultRating', Number(val));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#130f1d] shadow-[1.5px_1.5px_0px_#2d2638] h-9 text-xs">
                        <SelectValue placeholder="Stars Limit" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#1b1626]">
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="10">10 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Default Rating</label>
                    <Select
                      value={String(getFieldConfig(selectedField).defaultRating ?? '0')}
                      onValueChange={(val) => handleFieldPropertyChange(selectedField, 'defaultRating', Number(val))}
                    >
                      <SelectTrigger className="w-full border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#130f1d] shadow-[1.5px_1.5px_0px_#2d2638] h-9 text-xs">
                        <SelectValue placeholder="No Default" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-[#2d2638] rounded-xl bg-white dark:bg-[#1b1626]">
                        <SelectItem value="0">No default (0 stars)</SelectItem>
                        {Array.from({ length: Number(getFieldConfig(selectedField).maxStars ?? '5') }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={String(num)}>{num} Star{num > 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedField.type === 'SIGNATURE' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Canvas Height (px)</label>
                  <Input
                    type="number"
                    value={getFieldConfig(selectedField).height ?? '120'}
                    onChange={(e) => handleFieldPropertyChange(selectedField, 'height', e.target.value)}
                    className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                  />
                </div>
              )}

              {selectedField.type === 'ADDRESS' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-white font-patrick-hand">Shown Fields</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['street', 'city', 'state', 'country', 'zip'].map((sub) => {
                      const shownFields = getFieldConfig(selectedField).shownFields || { street: true, city: true, state: true, country: true, zip: true };
                      const isSubShown = shownFields[sub] !== false;
                      const displayNames: Record<string, string> = {
                        street: 'Street Address',
                        city: 'City',
                        state: 'State',
                        country: 'Country',
                        zip: 'Postal Code'
                      };
                      return (
                        <label key={sub} className="flex items-center gap-2 text-xs font-semibold text-slate-600 capitalize cursor-pointer select-none">
                          <Checkbox
                            checked={isSubShown}
                            onCheckedChange={(val) => {
                              const newShown = { ...shownFields, [sub]: val === true };
                              handleFieldPropertyChange(selectedField, 'shownFields', newShown);
                            }}
                            className="border-2 border-foreground rounded-md size-4"
                          />
                          {displayNames[sub] || sub}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedField.type === 'TERMS' && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Terms Label / Text</label>
                    <Input
                      value={getFieldConfig(selectedField).termsText ?? 'I agree to the Terms & Conditions and Privacy Policy.'}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'termsText', e.target.value)}
                      placeholder="Checkbox legal terms label text"
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Terms Link URL (Optional)</label>
                    <Input
                      value={getFieldConfig(selectedField).termsUrl ?? ''}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'termsUrl', e.target.value)}
                      placeholder="https://example.com/terms"
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Full Terms Content (Modal Pop-up)</label>
                    <Textarea
                      value={getFieldConfig(selectedField).termsContent ?? ''}
                      onChange={(e) => handleFieldPropertyChange(selectedField, 'termsContent', e.target.value)}
                      placeholder="Enter the full terms text. This will open in a modal when clicked."
                      className="border-2 border-[#2d2638] rounded-xl p-2 bg-white dark:bg-[#130f1d] shadow-[1px_1px_0px_#2d2638] text-xs min-h-[80px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Actions */}
            <div className="flex gap-2 pt-4 border-t-2 border-dashed border-[#2d2638]/20 mt-4">
              <Button
                type="button"
                onClick={() => handleDuplicate(selectedField)}
                className="flex-1 border-2 border-foreground bg-[#fff9cc] text-[#2d2638] font-bold h-9 text-xs rounded-xl shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-patrick-hand"
              >
                <Copy className="size-3.5" /> Duplicate
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleDelete(selectedField.id);
                }}
                className="flex-1 border-2 border-foreground bg-rose-100 text-rose-700 font-bold h-9 text-xs rounded-xl shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-patrick-hand"
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const renderPreviewInput = (field: any) => {
  const config = (() => {
    try {
      return field.configuration ? JSON.parse(field.configuration) : {};
    } catch {
      return {};
    }
  })();

  const commonClass = "w-full bg-[#fcfbf9] dark:bg-[#151121] border-2 border-[#2d2638] rounded-xl h-10 px-3 flex items-center text-xs font-bold text-slate-400 select-none pointer-events-none";

  switch (field.type) {
    case 'TEXT':
    case 'NUMBER':
    case 'EMAIL':
    case 'PASSWORD':
      return <div className={commonClass}>{field.placeholder || `Enter ${field.label.toLowerCase()}...`}</div>;
    case 'YES_NO':
      return (
        <div className="flex gap-2">
          <div className="border-2 border-[#2d2638] rounded-xl py-1 px-4 text-xs font-bold bg-white text-slate-600 select-none">Yes</div>
          <div className="border-2 border-[#2d2638] rounded-xl py-1 px-4 text-xs font-bold bg-white text-slate-600 select-none">No</div>
        </div>
      );
    case 'TEXTAREA':
      return (
        <div className="w-full bg-[#fcfbf9] dark:bg-[#151121] border-2 border-[#2d2638] rounded-xl p-3 text-xs font-bold text-slate-400 min-h-[60px] select-none pointer-events-none">
          {field.placeholder || "Enter long response..."}
        </div>
      );
    case 'PHONE':
      return (
        <div className="flex gap-2 items-center w-full">
          <div className="bg-[#f2efe6] dark:bg-[#201b2b] border-2 border-[#2d2638] rounded-xl h-10 px-3 flex items-center justify-center font-bold text-xs text-slate-600 select-none">
            {config.countryCode || '+91'}
          </div>
          <div className={`${commonClass} flex-1`}>{field.placeholder || "Enter phone number..."}</div>
        </div>
      );
    case 'DROPDOWN': {
      const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : ['India', 'USA', 'Canada']);
      return (
        <div className="w-full bg-white border-2 border-[#2d2638] rounded-xl h-10 px-4 flex items-center justify-between text-xs font-bold text-slate-600 select-none">
          <span>{opts[0] || 'Select option...'}</span>
          <span className="text-[10px]">▼</span>
        </div>
      );
    }
    case 'CHECKBOX': {
      const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : []);
      if (opts.length > 0) {
        return (
          <div className="flex flex-col gap-2 pt-1">
            {opts.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-600 pointer-events-none select-none">
                <div className="border-2 border-[#2d2638] rounded-md size-4 bg-white" />
                {opt}
              </label>
            ))}
          </div>
        );
      }
      return (
        <label className="flex items-center gap-3 text-xs font-bold text-slate-600 pointer-events-none select-none">
          <div className="border-2 border-[#2d2638] rounded-md size-4 bg-white" />
          {field.placeholder || 'Select this checkbox'}
        </label>
      );
    }
    case 'RADIO': {
      const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : ['Male', 'Female', 'Other']);
      return (
        <div className="flex flex-col gap-2 pt-1">
          {opts.map((opt: string, idx: number) => (
            <label key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-600 pointer-events-none select-none">
              <div className="border-2 border-[#2d2638] rounded-full size-4 bg-white" />
              {opt}
            </label>
          ))}
        </div>
      );
    }
    case 'DATE':
      return <div className={commonClass}>{config.minDate ? `Date (min: ${config.minDate})` : 'Select Date...'}</div>;
    case 'RATING': {
      const starsCount = config.maxStars || 5;
      const defaultVal = config.defaultRating || 0;
      return (
        <div className="flex items-center gap-1.5 py-1">
          {Array.from({ length: starsCount }).map((_, i) => (
            <span key={i} className={`text-xl ${i < defaultVal ? 'text-[#ffb703]' : 'text-slate-300'}`}>★</span>
          ))}
        </div>
      );
    }
    case 'SIGNATURE': {
      const padHeight = Number(config.height || 120);
      return (
        <div className="border-2 border-dashed border-[#2d2638]/40 rounded-xl bg-[#faf9f5] flex flex-col items-center justify-center p-3 w-full select-none" style={{ height: Math.max(60, padHeight / 2) }}>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Signature Area (Height: {padHeight}px)</span>
        </div>
      );
    }
    case 'ADDRESS': {
      const shown = config.shownFields || { street: true, city: true, state: true, country: true, zip: true };
      const displayNames: Record<string, string> = {
        street: 'Street Address',
        city: 'City',
        state: 'State',
        country: 'Country',
        zip: 'Postal Code'
      };
      return (
        <div className="border-2 border-foreground rounded-xl p-3 bg-white space-y-2 max-w-sm w-full select-none">
          {shown.street !== false && <div className="border-2 border-[#2d2638] rounded-lg h-8 px-2 flex items-center text-[10px] font-bold text-slate-400">{displayNames.street}</div>}
          <div className="grid grid-cols-2 gap-1.5">
            {shown.city !== false && <div className="border-2 border-[#2d2638] rounded-lg h-8 px-2 flex items-center text-[10px] font-bold text-slate-400">{displayNames.city}</div>}
            {shown.state !== false && <div className="border-2 border-[#2d2638] rounded-lg h-8 px-2 flex items-center text-[10px] font-bold text-slate-400">{displayNames.state}</div>}
            {shown.zip !== false && <div className="border-2 border-[#2d2638] rounded-lg h-8 px-2 flex items-center text-[10px] font-bold text-slate-400">{displayNames.zip}</div>}
            {shown.country !== false && <div className="border-2 border-[#2d2638] rounded-lg h-8 px-2 flex items-center text-[10px] font-bold text-slate-400">{displayNames.country}</div>}
          </div>
        </div>
      );
    }
    case 'TERMS':
      return (
        <label className="flex items-start gap-3.5 text-xs font-bold text-slate-600 pointer-events-none select-none">
          <div className="border-2 border-[#2d2638] rounded-md size-4 bg-white mt-0.5 shrink-0" />
          <span>
            {config.termsText || field.placeholder || 'I agree to the Terms & Conditions.'}
            {config.termsUrl && <span className="text-blue-500 underline ml-1 font-bold">(Link: {config.termsUrl})</span>}
            {config.termsContent && <span className="text-purple-500 ml-1 font-bold">(Modal content added)</span>}
          </span>
        </label>
      );
    case 'PDF':
    case 'IMAGE':
    case 'MULTIPLE_IMAGES':
      return (
        <div className="border-2 border-dashed border-[#2d2638]/40 rounded-xl bg-white p-4 flex flex-col items-center justify-center gap-1 w-full max-w-xs select-none">
          <span className="text-xs font-bold text-slate-500">Upload {field.type.toLowerCase().replace('_', ' ')}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">Drag & drop files or click</span>
        </div>
      );
    default:
      return <div className={commonClass}>Input Preview</div>;
  }
};

function SortableFieldItem({
  field,
  isSelected,
  onClick,
  handleDelete,
  deleting,
}: {
  field: any;
  isSelected: boolean;
  onClick: () => void;
  handleDelete: (id: string) => void;
  deleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`relative rounded-xl border bg-card/60 p-4 transition-all duration-200 cursor-pointer select-none ${
        isDragging
          ? 'z-50 border-[#7b61ff] shadow-lg ring-2 ring-[#7b61ff]/20 scale-[1.01] bg-card'
          : isSelected
          ? 'border-2 border-[#7b61ff] bg-white shadow-[3px_3px_0px_#7b61ff]'
          : 'border-2 border-[#2d2638] shadow-[2px_2px_0px_#2d2638] bg-white hover:border-[#7b61ff]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          type="button"
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent/50 transition-colors touch-none"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()} // Prevent selection when dragging
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground font-patrick-hand">{field.label}</p>
            <span className="rounded-full border border-foreground/30 px-2 py-0.5 text-xs text-muted-foreground font-patrick-hand">
              {String(field.type).replace('_', ' ')}
            </span>
            {field.isRequired && (
              <span className="rounded-full border px-2 py-0.5 text-xs text-foreground bg-primary/10 border-primary/20 font-patrick-hand">
                Required
              </span>
            )}
          </div>

          {field.description && (
            <p className="mt-1 text-sm text-muted-foreground font-patrick-hand">{field.description}</p>
          )}

          {/* Live visual preview of the input */}
          <div className="mt-3.5 pt-3 border-t border-[#2d2638]/10 w-full max-w-full overflow-hidden">
            {renderPreviewInput(field)}
          </div>

          <p className="mt-2 text-[10px] text-muted-foreground font-mono">{field.labelKey}</p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="border border-foreground rounded-lg h-8 w-8 hover:bg-slate-50 cursor-pointer shadow-[1px_1px_0px_#000]"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(field.id);
            }}
            disabled={deleting}
            className="border border-foreground rounded-lg h-8 w-8 hover:bg-rose-50 cursor-pointer shadow-[1px_1px_0px_#000]"
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
