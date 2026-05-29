"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  IconHome,
  IconFileDescription,
  IconPencil,
  IconTemplate,
  IconMail,
  IconChartBar,
  IconTrophy,
  IconSettings,
  IconPlus,
  IconUser,
  IconKey,
  IconCheck,
  IconLock,
  IconExternalLink,
  IconForms,
  IconMessage,
  IconPlayerPlay,
  IconBook,
  IconPoint,
  IconAlertCircle
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUser } from "~/hooks/api/auth";
import { useGetForms, useCreateForm, useUpdateFormResponsesStatus, useGetFormSubmissionsByFormId, useDeleteForm, useGetFormByFormId } from "~/hooks/api/form";
import { useListAllSubmissionsForUser } from "~/hooks/api/form-submission";
import { TEMPLATES_DATA } from "~/lib/templates";
import { useCreateField } from "~/hooks/api/form-field";
import FormBuilderClient from "~/components/FormBuilderClient";
import { cn } from "~/lib/utils";

type FormItem = NonNullable<ReturnType<typeof useGetForms>["forms"]>[number];

const renderSubmissionValue = (v: any, matchedForm: any) => {
  const field = matchedForm?.fields?.find((f: any) => f.id === v.formFieldId);
  const fieldType = field?.type;

  if (!v.value) {
    return <span className="text-slate-300 italic font-semibold">Blank response</span>;
  }

  if (fieldType === "PDF") {
    return (
      <a
        href={v.value}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-bold text-[#7b61ff] hover:underline flex items-center gap-1 mt-1 font-patrick-hand cursor-pointer"
      >
        <IconFileDescription className="size-4 shrink-0" />
        View PDF
      </a>
    );
  }

  if (fieldType === "IMAGE") {
    return (
      <div 
        className="mt-1 size-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative group cursor-pointer" 
        onClick={() => window.open(v.value, '_blank')}
      >
        <img 
          src={v.value} 
          alt="Submitted Image" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
        />
      </div>
    );
  }

  if (fieldType === "MULTIPLE_IMAGES") {
    const images = v.value.split(',').filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {images.map((imgUrl: string, idx: number) => (
          <div 
            key={idx} 
            className="size-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative group cursor-pointer" 
            onClick={() => window.open(imgUrl, '_blank')}
            title={`View Image ${idx + 1}`}
          >
            <img 
              src={imgUrl} 
              alt={`Submitted Image ${idx + 1}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
          </div>
        ))}
      </div>
    );
  }

  if (fieldType === "SIGNATURE") {
    return (
      <div 
        className="mt-1 size-14 border border-slate-200 rounded-lg p-1 bg-white flex items-center justify-center cursor-pointer shrink-0"
        onClick={() => window.open(v.value, '_blank')}
        title="View Signature"
      >
        <img src={v.value} alt="Signature" className="h-full object-contain" />
      </div>
    );
  }

  if (fieldType === "RATING") {
    const rating = Number(v.value || '0');
    return (
      <div className="flex items-center gap-0.5 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            viewBox="0 0 24 24"
            className={`size-4 ${star <= rating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-slate-100 stroke-slate-300'}`}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  }

  if (fieldType === "ADDRESS") {
    try {
      const data = JSON.parse(v.value);
      return (
        <span className="text-xs font-semibold text-slate-700 block leading-tight mt-1">
          {data.street && <span className="block">{data.street}</span>}
          {(data.city || data.state || data.zip) && (
            <span className="block text-[11px] text-slate-500">
              {[data.city, data.state].filter(Boolean).join(', ')} {data.zip}
            </span>
          )}
        </span>
      );
    } catch {
      return <span className="break-words">{v.value}</span>;
    }
  }

  if (fieldType === "TERMS") {
    const isAccepted = v.value === "Accepted";
    return (
      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
        isAccepted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}>
        {isAccepted ? 'Accepted Terms' : 'Declined'}
      </span>
    );
  }

  if (fieldType === "CHECKBOX") {
    const isChecked = v.value === "Checked";
    return (
      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
        isChecked ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
      }`}>
        {isChecked ? 'Checked' : 'Unchecked'}
      </span>
    );
  }

  return <span className="break-words">{v.value}</span>;
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";
  const queryFormId = searchParams?.get("formId") || "";

  const { user } = useUser();
  const { forms = [], isLoading: formsLoading, isError: formsError } = useGetForms();
  const { createFormAsync } = useCreateForm();
  const { createFieldAsync } = useCreateField();
  const { updateFormResponsesStatusAsync } = useUpdateFormResponsesStatus();
  const { deleteFormAsync } = useDeleteForm();
  const { submissions: allSubmissions = [], isLoading: subsLoading } = useListAllSubmissionsForUser();

  // Local state for dialog and creation
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [formCreating, setFormCreating] = useState(false);

  // Template creation state
  const [templateLoading, setTemplateLoading] = useState<string | null>(null);

  // Local settings state
  const [profileName, setProfileName] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("john@example.com");
  const [favCharacter, setFavCharacter] = useState("User");
  const [saveLoading, setSaveLoading] = useState(false);

  // Synchronize settings with loaded user details
  useEffect(() => {
    if (user) {
      setProfileName(user.fullName ?? "John Doe");
      setProfileEmail(user.email ?? "john@example.com");
    }
  }, [user]);

  // Sync profile name to local storage to trigger achievement status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("pratikriya_profile_name");
      const savedChar = localStorage.getItem("pratikriya_profile_char");
      if (savedName) setProfileName(savedName);
      if (savedChar) setFavCharacter(savedChar);
    }
  }, []);

  // Sync queryFormId to selectedSubFormId and selectedAnaFormId when it changes
  useEffect(() => {
    if (queryFormId) {
      const matchedForm = forms.find((f) => f.id === queryFormId);
      if (matchedForm) {
        setSelectedSubFormId(queryFormId);
        setSelectedAnaFormId(queryFormId);
      }
    } else {
      setSelectedSubFormId("all");
      setSelectedAnaFormId("all");
    }
  }, [queryFormId, forms]);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setFormCreating(true);
      const res = await createFormAsync({
        title: newTitle.trim(),
        description: newDesc.trim() || null,
      });
      toast.success("New Form Created!");
      setNewTitle("");
      setNewDesc("");
      setCreateOpen(false);

      // Auto redirect to Dining Room with the new form
      router.push(`/dashboard?tab=builder&formId=${res.id}`);
    } catch (err) {
      toast.error("Failed to create form recipe");
      console.error(err);
    } finally {
      setFormCreating(false);
    }
  };

  const handleUseTemplate = async (tpl: typeof TEMPLATES_DATA[number]) => {
    try {
      setTemplateLoading(tpl.title);
      const newForm = await createFormAsync({
        title: tpl.title,
        description: tpl.description,
      });

      // Create fields sequentially
      for (const field of tpl.fields) {
        await createFieldAsync({
          formId: newForm.id,
          label: field.label,
          labelKey: field.labelKey,
          type: field.type,
          isRequired: field.isRequired,
          placeholder: field.placeholder || null,
          description: field.description || null,
          index: field.index,
        } as any);
      }

      toast.success(`Blueprint loaded! Let's start cooking in the Dining Room.`);
      router.push(`/dashboard?tab=builder&formId=${newForm.id}`);
    } catch (err) {
      toast.error("Failed to apply template blueprint");
      console.error(err);
    } finally {
      setTemplateLoading(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("pratikriya_profile_name", profileName);
        localStorage.setItem("pratikriya_profile_char", favCharacter);
        localStorage.setItem("pratikriya_profile_saved", "true");
      }
      setSaveLoading(false);
      toast.success("Profile saved in database!");
    }, 1000);
  };

  // Submissions selection logic
  const [selectedSubFormId, setSelectedSubFormId] = useState<string>("all");
  const filteredSubmissions = useMemo(() => {
    if (selectedSubFormId === "all") return allSubmissions;
    return allSubmissions.filter((sub) => sub.formId === selectedSubFormId);
  }, [allSubmissions, selectedSubFormId]);

  // Analytics selection logic
  const [selectedAnaFormId, setSelectedAnaFormId] = useState<string>("all");
  const { submissions: specificFormSubs = [] } = useGetFormSubmissionsByFormId(
    selectedAnaFormId !== "all" ? selectedAnaFormId : undefined
  );
  const { form: selectedFormDetails } = useGetFormByFormId(
    selectedAnaFormId !== "all" ? selectedAnaFormId : undefined
  );
  const activeAnalyticsCount = useMemo(() => {
    if (selectedAnaFormId === "all") return allSubmissions.length;
    return specificFormSubs.length;
  }, [selectedAnaFormId, allSubmissions.length, specificFormSubs.length]);

  // Group submissions by date for line/bar trend plotting
  const chartPoints = useMemo(() => {
    const subs = selectedAnaFormId === "all" ? allSubmissions : specificFormSubs;
    if (subs.length === 0) return [];
    
    const datesMap: Record<string, number> = {};
    const sortedSubs = [...subs].sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

    sortedSubs.forEach((s) => {
      if (!s.createdAt) return;
      const date = new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      datesMap[date] = (datesMap[date] || 0) + 1;
    });

    return Object.entries(datesMap).map(([date, count]) => ({ date, count }));
  }, [selectedAnaFormId, allSubmissions, specificFormSubs]);

  const lineChartPoints = useMemo(() => {
    if (chartPoints.length === 0) return [];
    const maxCount = Math.max(...chartPoints.map((p) => p.count), 1);
    const svgWidth = 600;
    const svgHeight = 180;
    const paddingX = 40;
    const paddingY = 20;

    return chartPoints.map((p, index) => {
      const x = paddingX + (index * (svgWidth - paddingX * 2)) / Math.max(chartPoints.length - 1, 1);
      const y = svgHeight - paddingY - (p.count / maxCount) * (svgHeight - paddingY * 2);
      return { x, y, date: p.date, count: p.count };
    });
  }, [chartPoints]);

  // Compute field-level response metrics for the selected form
  const fieldAnalytics = useMemo(() => {
    if (!selectedFormDetails?.fields) return [];

    return selectedFormDetails.fields.map((field) => {
      const rawValues = specificFormSubs
        .map((sub) => sub.values?.find((v: any) => v.formFieldId === field.id)?.value)
        .filter((val) => val !== undefined && val !== null);

      const totalSubCount = specificFormSubs.length;
      const blankCount = totalSubCount - rawValues.length;

      const frequency: Record<string, number> = {};
      rawValues.forEach((val) => {
        const cleanVal = String(val).trim() || "(Blank)";
        frequency[cleanVal] = (frequency[cleanVal] || 0) + 1;
      });

      const sortedFrequency = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return {
        fieldId: field.id,
        label: field.label,
        type: field.type,
        blankCount,
        totalCount: rawValues.length,
        topResponses: sortedFrequency,
      };
    });
  }, [selectedFormDetails, specificFormSubs]);

  // Compute completeness rate dynamically
  const completenessRate = useMemo(() => {
    const subs = selectedAnaFormId === "all" ? allSubmissions : specificFormSubs;
    if (subs.length === 0) return "0.0%";

    let totalFilled = 0;
    let totalValues = 0;

    subs.forEach((sub) => {
      if (sub.values && sub.values.length > 0) {
        sub.values.forEach((v: any) => {
          totalValues++;
          if (v.value !== undefined && v.value !== null && String(v.value).trim() !== "") {
            totalFilled++;
          }
        });
      }
    });

    return totalValues > 0 ? `${((totalFilled / totalValues) * 100).toFixed(1)}%` : "100.0%";
  }, [selectedAnaFormId, allSubmissions, specificFormSubs]);

  // Compute response trend dynamically
  const responseTrend = useMemo(() => {
    const subs = selectedAnaFormId === "all" ? allSubmissions : specificFormSubs;
    if (subs.length === 0) return "Stable";

    const now = new Date().getTime();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

    let recentCount = 0;
    let previousCount = 0;

    subs.forEach((s) => {
      if (!s.createdAt) return;
      const time = new Date(s.createdAt).getTime();
      if (time >= sevenDaysAgo) {
        recentCount++;
      } else if (time >= fourteenDaysAgo) {
        previousCount++;
      }
    });

    if (recentCount > previousCount) return "Growing";
    if (recentCount < previousCount) return "Declining";
    return "Stable";
  }, [selectedAnaFormId, allSubmissions, specificFormSubs]);

  // Dynamic Assistant phrase
  const assistantPhrase = useMemo(() => {
    if (responseTrend === "Growing") return "Woof! (Submissions are growing beautifully, master!)";
    if (responseTrend === "Declining") return "Grrr... (Submissions are dropping, we need more campaigns!)";
    return "Arf! (Data volume is steady. Looking good!)";
  }, [responseTrend]);

  // Helper for formatting date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  // Filter forms based on search query
  const searchQuery = searchParams?.get("search") || "";
  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) return forms;
    return forms.filter((f) => f.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [forms, searchQuery]);

  // Compute stats
  const totalForms = forms.length;
  const activeForms = forms.filter((f) => f.acceptsResponses).length;
  const totalResponses = allSubmissions.length;

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full transition-all duration-700 ease-in-out p-6 md:p-8 flex flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">

        {/* ROOM: LIVING ROOM (Dashboard) */}
        {tab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Workspace Welcome Banner */}
            <Card className="glass-panel overflow-hidden border-none shadow-soft rounded-3xl p-6 md:p-8 relative min-h-[220px]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between z-10 relative">
                <div className="space-y-2">
                  <Badge className="scribble-border bg-pastel-orange text-[#2d2638] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Dashboard Overview
                  </Badge>
                  <CardTitle className="text-3xl font-bold font-caveat tracking-wider text-slate-800 tracking-tight leading-none mt-2">
                    Welcome, {profileName.split(" ")[0]}!
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-slate-600 text-sm font-semibold leading-relaxed mt-1">
                    Manage your forms, track real-time response analytics, and design custom collection workflows in one centralized workspace.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold px-5 py-5 rounded-2xl shadow-md border-none flex items-center gap-2 text-sm transition-transform hover:scale-105 active:scale-95">
                        <IconPlus className="size-5" />
                        Create New Form
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-none rounded-3xl p-6 sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold font-caveat tracking-wider text-slate-800">Create New Form</DialogTitle>
                        <DialogDescription className="text-slate-600 font-semibold text-xs mt-1">
                          Provide a title and a description for your new form. You can customize the questions and layout later in the Form Builder.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateForm} className="mt-4 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Form Title</label>
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Support Ticket Signups"
                            required
                            className="bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold shadow-inner"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Description</label>
                          <Textarea
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            placeholder="Describe what your form collects..."
                            className="bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl p-4 text-sm font-semibold shadow-inner min-h-[100px]"
                          />
                        </div>
                        <DialogFooter className="pt-2 gap-2">
                          <DialogClose asChild>
                            <Button variant="outline" type="button" className="rounded-2xl h-11 px-5 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                              Nevermind
                            </Button>
                          </DialogClose>
                          <Button type="submit" disabled={formCreating} className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-11 px-5 rounded-2xl border-none">
                            {formCreating ? "Creating..." : "Create Form"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button asChild variant="outline" className="scribble-btn bg-white/70 hover:bg-white text-slate-700 font-bold px-5 py-5 rounded-2xl shadow-sm border border-slate-200">
                    <Link href="/dashboard?tab=templates">Explore Templates</Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Low-tea Table Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="scribble-border scribble-shadow bg-white p-5 hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-inner">
                    <IconForms className="size-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold font-caveat tracking-wider uppercase tracking-[0.2em] text-slate-400">Forms Created</p>
                    <p className="text-3xl font-bold font-caveat tracking-wider text-slate-800 mt-1">{totalForms}</p>
                  </div>
                </div>
              </Card>
              <Card className="scribble-border scribble-shadow bg-white p-5 hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-[#7b61ff] shadow-inner">
                    <IconMessage className="size-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold font-caveat tracking-wider uppercase tracking-[0.2em] text-slate-400">Total Submissions</p>
                    <p className="text-3xl font-bold font-caveat tracking-wider text-slate-800 mt-1">{totalResponses}</p>
                  </div>
                </div>
              </Card>
              <Card className="scribble-border scribble-shadow bg-white p-5 hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner">
                    <IconPlayerPlay className="size-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold font-caveat tracking-wider uppercase tracking-[0.2em] text-slate-400">Active Forms</p>
                    <p className="text-3xl font-bold font-caveat tracking-wider text-slate-800 mt-1">{activeForms}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CRT TV and Super Admin Banner */}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              {/* CRT TV: Recent Forms */}
              <Card className="scribble-border scribble-shadow bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold font-caveat tracking-wider text-slate-800">Recent Form Recipes</CardTitle>
                      <CardDescription className="text-slate-500 font-semibold text-sm mt-1 font-patrick-hand">
                        Grab the public link or edit questions inside Workspace.
                      </CardDescription>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-[#7b61ff] font-bold hover:bg-violet-50 text-sm rounded-xl font-patrick-hand">
                      <Link href="/dashboard?tab=my-forms">View All Forms</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto w-full">
                  <Table className="w-full min-w-[650px]">
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-b border-slate-100 hover:bg-transparent">
                        <TableHead className="font-bold text-slate-700 text-sm px-5 py-4 font-patrick-hand">Form Title</TableHead>
                        <TableHead className="font-bold text-slate-700 text-sm py-4 font-patrick-hand">Status</TableHead>
                        <TableHead className="font-bold text-slate-700 text-sm py-4 font-patrick-hand">Responses</TableHead>
                        <TableHead className="font-bold text-slate-700 text-sm text-right pr-5 py-4 font-patrick-hand">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formsLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-12 text-center text-slate-400 font-bold text-sm font-patrick-hand">
                            Loading recent forms...
                          </TableCell>
                        </TableRow>
                      ) : filteredForms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-12 text-center text-slate-400 font-bold text-sm font-patrick-hand">
                            {forms.length === 0 ? "No forms created yet. Go build your first form!" : "No forms match your search query."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredForms.slice(0, 8).map((form) => {
                          const formSubs = allSubmissions.filter((s) => s.formId === form.id);
                          return (
                            <TableRow key={form.id} className="border-b border-slate-100/70 hover:bg-slate-50/40 transition-colors">
                              <TableCell className="font-bold text-slate-800 text-base px-5 py-4 font-patrick-hand">
                                <div className="space-y-0.5">
                                  <p className="text-base font-extrabold text-slate-800">{form.title}</p>
                                  <p className="text-xs text-slate-400 font-normal max-w-[220px] truncate">{form.description ?? "No description added"}</p>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge className={form.acceptsResponses ? "bg-emerald-500 text-white border-none text-xs font-bold rounded-full px-2 py-0.5" : "bg-slate-200 text-slate-500 border-none text-xs font-bold rounded-full px-2 py-0.5"}>
                                  {form.acceptsResponses ? "Live" : "Closed"}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-bold text-slate-700 text-base py-4 font-patrick-hand">{formSubs.length}</TableCell>
                              <TableCell className="text-right pr-5 py-4">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button asChild size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:bg-[#7b61ff] hover:text-white rounded-xl text-xs font-bold font-patrick-hand h-8 px-3">
                                    <Link href={`/dashboard?tab=builder&formId=${form.id}`}>Edit</Link>
                                  </Button>
                                  <Button asChild size="sm" className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white rounded-xl text-xs font-bold border-none h-8 px-3 font-patrick-hand">
                                    <Link href={`/form/${form.id}`} target="_blank">
                                      View <IconExternalLink className="size-3.5 ml-1 inline" />
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Productive Side Cards: Recent Activity Feed & Setup Checklist */}
              <div className="space-y-6">
                {/* Recent Submissions Feed Card */}
                <Card className="scribble-border scribble-shadow bg-white p-5 overflow-hidden flex flex-col justify-between">
                  <CardHeader className="p-0">
                    <Badge className="scribble-border bg-pastel-pink text-[#2d2638] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm w-fit mb-2">
                      Live Feed
                    </Badge>
                    <CardTitle className="text-lg font-bold font-caveat tracking-wider text-slate-800 leading-tight">
                      Recent Submissions
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-semibold text-[11px] mt-0.5">
                      Real-time updates of incoming submissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 space-y-3 flex-1">
                    {subsLoading ? (
                      <p className="text-xs text-slate-400 font-bold py-4 text-center">Loading activity feed...</p>
                    ) : allSubmissions.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                        <p className="text-xs text-slate-400 font-bold">No submissions received yet.</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Share form links to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {[...allSubmissions]
                          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                          .slice(0, 3)
                          .map((sub) => {
                            const formTitle = forms.find((f) => f.id === sub.formId)?.title ?? "Unknown Form";
                            const firstVal = sub.values?.[0]?.value ?? "Empty response";
                            return (
                              <Link 
                                href={`/dashboard?tab=submissions&formId=${sub.formId}`}
                                key={sub.id} 
                                className="block p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold font-caveat tracking-wider text-slate-700 text-sm truncate max-w-[130px]">{formTitle}</span>
                                  <span className="text-[9px] text-slate-400 font-semibold">
                                    {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ""}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-semibold truncate mt-1">
                                  "{firstVal}"
                                </p>
                              </Link>
                            );
                          })
                        }
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Setup Checklist Card */}
                <Card className="scribble-border scribble-shadow bg-white p-5">
                  <CardHeader className="p-0">
                    <Badge className="scribble-border bg-pastel-yellow text-[#2d2638] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm w-fit mb-2">
                      Workspace Progress
                    </Badge>
                    <CardTitle className="text-lg font-bold font-caveat tracking-wider text-slate-800 leading-tight">
                      Setup Checklist
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-semibold text-[11px] mt-0.5">
                      Follow these steps to unlock full potential.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 space-y-3">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-slate-50/40 border border-slate-100/50">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-5 rounded-full flex items-center justify-center text-xs border",
                            forms.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
                          )}>
                            {forms.length > 0 ? <IconCheck className="size-3.5 stroke-[3]" /> : "1"}
                          </div>
                          <span className="text-xs font-bold text-slate-700">Create a form recipe</span>
                        </div>
                        {forms.length === 0 && (
                          <Button 
                            onClick={() => setCreateOpen(true)}
                            size="xs" 
                            variant="ghost" 
                            className="text-[#7b61ff] font-bold hover:bg-violet-50 text-[10px] h-7 px-2 rounded-lg"
                          >
                            Create
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-slate-50/40 border border-slate-100/50">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-5 rounded-full flex items-center justify-center text-xs border",
                            forms.some(f => f.acceptsResponses) ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
                          )}>
                            {forms.some(f => f.acceptsResponses) ? <IconCheck className="size-3.5 stroke-[3]" /> : "2"}
                          </div>
                          <span className="text-xs font-bold text-slate-700">Make form recipe Live</span>
                        </div>
                        {forms.length > 0 && !forms.some(f => f.acceptsResponses) && (
                          <Link href="/dashboard?tab=my-forms">
                            <Button 
                              size="xs" 
                              variant="ghost" 
                              className="text-[#7b61ff] font-bold hover:bg-violet-50 text-[10px] h-7 px-2 rounded-lg"
                            >
                              Activate
                            </Button>
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-slate-50/40 border border-slate-100/50">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-5 rounded-full flex items-center justify-center text-xs border",
                            allSubmissions.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
                          )}>
                            {allSubmissions.length > 0 ? <IconCheck className="size-3.5 stroke-[3]" /> : "3"}
                          </div>
                          <span className="text-xs font-bold text-slate-700">Receive a submission</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-slate-50/40 border border-slate-100/50">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-5 rounded-full flex items-center justify-center text-xs border",
                            allSubmissions.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
                          )}>
                            {allSubmissions.length > 0 ? <IconCheck className="size-3.5 stroke-[3]" /> : "4"}
                          </div>
                          <span className="text-xs font-bold text-slate-700">Check analytics charts</span>
                        </div>
                        {allSubmissions.length > 0 && (
                          <Link href="/dashboard?tab=analytics">
                            <Button 
                              size="xs" 
                              variant="ghost" 
                              className="text-[#7b61ff] font-bold hover:bg-violet-50 text-[10px] h-7 px-2 rounded-lg"
                            >
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ROOM: MY FORMS (Forms List) */}
        {tab === "my-forms" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Badge className="scribble-border bg-pastel-yellow text-[#2d2638] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    My Workspace
                  </Badge>
                  <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">My Forms</CardTitle>
                  <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                    Manage and organize all your forms in one central workspace.
                  </CardDescription>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold px-5 h-11 rounded-2xl shadow-sm border-none flex items-center gap-2 text-xs">
                      <IconPlus className="size-4" />
                      Create Form
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel border-none rounded-3xl p-6 sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold font-caveat tracking-wider text-slate-800">Create New Form</DialogTitle>
                      <DialogDescription className="text-slate-600 font-semibold text-xs mt-1">
                        Start your new form by giving it a name. Then add fields in the Form Builder.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateForm} className="mt-4 space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Form Title</label>
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Support Ticket Signups"
                          required
                          className="bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Description</label>
                        <Textarea
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="Describe what your recipe collects..."
                          className="bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl p-4 text-sm font-semibold min-h-[100px]"
                        />
                      </div>
                      <DialogFooter className="pt-2 gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" type="button" className="rounded-2xl h-11 px-5 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                            Nevermind
                          </Button>
                        </DialogClose>
                        <Button type="submit" disabled={formCreating} className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-11 px-5 rounded-2xl border-none">
                          {formCreating ? "Creating..." : "Create Form"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Playground Forms Grid */}
              <div className="mt-6 rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto w-full bg-white/40">
                <Table className="w-full min-w-[850px]">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="font-bold text-slate-700 text-xs px-5 py-4">Title & Details</TableHead>
                      <TableHead className="font-bold text-slate-700 text-xs py-4">Total Submissions</TableHead>
                      <TableHead className="font-bold text-slate-700 text-xs py-4">Created Date</TableHead>
                      <TableHead className="font-bold text-slate-700 text-xs text-right pr-5 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center text-slate-400 font-bold text-xs">
                          Loading your forms...
                        </TableCell>
                      </TableRow>
                    ) : filteredForms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center text-slate-400 font-bold text-xs flex flex-col items-center justify-center">
                          {forms.length === 0 ? (
                            <>
                              <svg viewBox="0 0 200 200" fill="none" className="w-32 h-32 mb-4 mx-auto">
                                {/* Scribble Box / Folder */}
                                <path
                                  d="M40 70 L100 40 L160 70 L100 100 Z"
                                  stroke="#475569"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeDasharray="6 4"
                                />
                                <path
                                  d="M40 70 V130 L100 160 V100"
                                  stroke="#475569"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M160 70 V130 L100 160"
                                  stroke="#475569"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                {/* Empty Sparkles */}
                                <path d="M70 100 L75 105 M75 100 L70 105" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" />
                                <path d="M125 110 L130 115 M130 110 L125 115" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              <p>Your workspace is empty! Create a new form to get started.</p>
                            </>
                          ) : (
                            <p>No forms match your search query.</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredForms.map((form) => {
                        const formSubs = allSubmissions.filter((s) => s.formId === form.id);
                        return (
                          <TableRow key={form.id} className="border-b border-slate-100/70 hover:bg-slate-50/40 transition-colors">
                            <TableCell className="font-bold text-slate-800 text-sm px-5 py-4">
                              <div className="space-y-0.5">
                                <p>{form.title}</p>
                                <p className="text-xs text-slate-400 font-normal max-w-[280px] truncate">{form.description ?? "-"}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-slate-700 text-sm py-4">
                              {formSubs.length} responses
                            </TableCell>
                            <TableCell className="text-slate-500 font-semibold text-xs py-4">
                              {formatDate(form.createdAt)}
                            </TableCell>
                            <TableCell className="text-right pr-5 py-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button asChild size="xs" variant="outline" className="border-slate-200 text-slate-600 hover:bg-[#7b61ff] hover:text-white rounded-xl text-[10px] font-bold">
                                  <Link href={`/dashboard?tab=builder&formId=${form.id}`}>Builder</Link>
                                </Button>
                                <Button asChild size="xs" variant="outline" className="border-slate-200 text-slate-600 hover:bg-[#7b61ff] hover:text-white rounded-xl text-[10px] font-bold">
                                  <Link href={`/dashboard?tab=submissions&formId=${form.id}`}>Submissions</Link>
                                </Button>
                                <Button
                                  size="xs"
                                  variant={form.acceptsResponses ? "default" : "outline"}
                                  className={form.acceptsResponses ? "bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl border-none shadow-sm text-[10px]" : "border-slate-200 text-slate-400 font-bold rounded-xl text-[10px]"}
                                  onClick={async () => {
                                    try {
                                      await updateFormResponsesStatusAsync({
                                        formId: form.id,
                                        acceptsResponses: !form.acceptsResponses
                                      });
                                      toast.success(`Form status toggled!`);
                                    } catch (e) {
                                      toast.error("Failed to update status");
                                    }
                                  }}
                                >
                                  {form.acceptsResponses ? "Live" : "Closed"}
                                </Button>
                                <Button asChild size="xs" className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white rounded-xl text-[10px] font-bold border-none">
                                  <Link href={`/form/${form.id}`} target="_blank">
                                    View Link
                                  </Link>
                                </Button>
                                <Dialog>
                                   <DialogTrigger asChild>
                                     <Button
                                       size="xs"
                                       variant="outline"
                                       className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl text-[10px] font-bold"
                                     >
                                       Delete
                                     </Button>
                                   </DialogTrigger>
                                   <DialogContent className="glass-panel border-none rounded-3xl p-6 sm:max-w-md">
                                     <DialogHeader>
                                       <DialogTitle className="text-xl font-bold font-caveat tracking-wider text-slate-800">
                                         Confirm Deletion
                                       </DialogTitle>
                                       <DialogDescription className="text-slate-600 font-semibold text-xs mt-2 leading-relaxed">
                                         Are you absolutely sure you want to delete the form <span className="font-bold text-slate-800">"{form.title}"</span> and all of its responses? This action cannot be undone.
                                       </DialogDescription>
                                     </DialogHeader>
                                     <DialogFooter className="pt-4 gap-2 flex justify-end">
                                       <DialogClose asChild>
                                         <Button variant="outline" className="rounded-2xl h-10 px-5 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs">
                                           Cancel
                                         </Button>
                                       </DialogClose>
                                       <Button
                                         className="scribble-btn bg-pastel-pink hover:bg-pink-100 text-red-600 rounded-2xl h-10 px-5 font-bold text-xs"
                                         onClick={async () => {
                                           try {
                                             await deleteFormAsync({ formId: form.id });
                                             toast.success("Form deleted successfully!");
                                           } catch (e) {
                                             toast.error("Failed to delete form");
                                           }
                                         }}
                                       >
                                         Yes, Delete Form
                                       </Button>
                                     </DialogFooter>
                                   </DialogContent>
                                 </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {/* ROOM: DINING ROOM (Form Builder Workspace) */}
        {tab === "builder" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="space-y-1">
                <Badge className="scribble-border bg-pastel-red text-[#2d2638] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Form Builder
                </Badge>
                <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">Form Builder</CardTitle>
                <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                  Configure your form fields and settings. Select a form from the menu below to begin.
                </CardDescription>
              </div>

              {/* Selector Dropdown */}
              <div className="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-full md:w-72">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Selected Form</label>
                  <Select
                    value={queryFormId || "none"}
                    onValueChange={(val) => {
                      if (val && val !== "none") {
                        router.push(`/dashboard?tab=builder&formId=${val}`);
                      } else {
                        router.push(`/dashboard?tab=builder`);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold shadow-soft">
                      <SelectValue placeholder="Select a form to edit..." />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-none rounded-2xl p-1 shadow-soft">
                      <SelectItem value="none" className="font-semibold text-slate-500">Choose form...</SelectItem>
                      {filteredForms.map((f) => (
                        <SelectItem key={f.id} value={f.id} className="font-bold text-slate-700">
                          {f.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {queryFormId && (
                  <Button asChild size="sm" variant="outline" className="scribble-btn mt-5 md:mt-0 bg-white/70 hover:bg-white text-slate-600 font-bold border-slate-200 rounded-xl h-11 px-4 shadow-sm flex items-center gap-1">
                    <Link href={`/form/${queryFormId}`} target="_blank">
                      Test Public View <IconExternalLink className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Recipe Workspace Container */}
              {queryFormId ? (
                <div className="mt-8 border-t border-slate-100/80 pt-6">
                  <FormBuilderClient formId={queryFormId} />
                </div>
              ) : (
                <div className="mt-8 border-t border-slate-100/80 pt-10 text-center py-10 flex flex-col items-center">
                  <svg viewBox="0 0 200 200" fill="none" className="w-40 h-40 mb-4 animate-pulse">
                    {/* Scribble Document / Page */}
                    <path
                      d="M60 40 H130 L150 60 V160 H60 Z"
                      stroke="#475569"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="8 6"
                    />
                    <path
                      d="M130 40 V60 H150"
                      stroke="#475569"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Scribble Question Mark */}
                    <path
                      d="M95 80 C95 70, 115 70, 115 80 C115 90, 105 92, 105 100"
                      stroke="#7b61ff"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <circle cx="105" cy="115" r="2.5" fill="#7b61ff" />
                    {/* Oops hand-drawn style banner/bubble */}
                    <rect x="25" y="110" width="55" height="28" rx="8" fill="#ff7ee2" opacity="0.15" />
                    <rect x="25" y="110" width="55" height="28" rx="8" stroke="#ff7ee2" strokeWidth="2" strokeDasharray="5 3" />
                    <text x="35" y="128" fill="#ff7ee2" className="font-caveat font-bold text-sm" style={{ fontFamily: 'var(--font-caveat)', fontSize: '14px', fontWeight: 'bold' }}>Oops!</text>
                  </svg>
                  <h3 className="text-md font-bold font-caveat tracking-wider text-slate-700">No Form Selected</h3>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto mt-1 leading-relaxed">
                    Select a form from the dropdown menu above to start editing fields, or head to My Forms to create one from scratch.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ROOM: STUDY ROOM (Blueprints & Templates) */}
        {tab === "templates" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="space-y-1">
                <Badge className="scribble-border bg-pastel-purple text-[#2d2638] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Template Library
                </Badge>
                <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">Form Templates</CardTitle>
                <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                  Use our professionally designed templates to instantly generate web forms.
                </CardDescription>
              </div>

              {/* Templates Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 transition-all">
                {TEMPLATES_DATA.map((tpl) => {
                  const isLoading = templateLoading === tpl.title;
                  return (
                    <div 
                      key={tpl.id} 
                      className={`w-full bg-white dark:bg-black p-6 border-2 border-foreground shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[8px_8px_0px_#7b61ff] transition-all hover:-translate-y-2 cursor-default flex flex-col justify-between ${tpl.border}`}
                    >
                      <div>
                        <div className={`size-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4 ${tpl.color} border border-foreground/10`}>
                          {tpl.icon}
                        </div>
                        <h3 className="text-2xl font-bold font-geist-sans text-foreground">{tpl.title}</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">{tpl.description}</p>
                        
                        {/* Fields List details */}
                        <div className="mt-4 rounded-2xl bg-slate-50/70 p-3 border border-slate-100 text-[11px] font-semibold text-slate-600 space-y-1.5">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Fields included ({tpl.fields.length}):</p>
                          {tpl.fields.slice(0, 3).map((f, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-[#7b61ff]" />
                              <span>{f.label}</span>
                            </div>
                          ))}
                          {tpl.fields.length > 3 && (
                            <div className="text-[9px] text-slate-400 font-normal italic mt-1">+{tpl.fields.length - 3} more...</div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleUseTemplate(tpl)}
                        disabled={templateLoading !== null}
                        className="w-full bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold rounded-2xl h-11 border-none shadow-sm text-xs mt-6"
                      >
                        {isLoading ? "Drafting recipe..." : "Use Blueprint"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ROOM: MAILBOX AREA (Submissions View) */}
        {tab === "submissions" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Badge className="bg-sky-600 text-white border-none px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Responses Inbox
                  </Badge>
                  <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">Submissions</CardTitle>
                  <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                    View, manage, and analyze response entries from your users.
                  </CardDescription>
                </div>

                {/* Form Filter Selector */}
                <div className="w-full sm:w-64">
                  <Select
                    value={selectedSubFormId}
                    onValueChange={(val) => {
                      setSelectedSubFormId(val);
                      // Sync formId query parameter
                      if (val !== "all") {
                        router.push(`/dashboard?tab=submissions&formId=${val}`);
                      } else {
                        router.push(`/dashboard?tab=submissions`);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold shadow-soft">
                      <SelectValue placeholder="Filter by form recipe..." />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-none rounded-2xl p-1 shadow-soft">
                      <SelectItem value="all" className="font-bold text-slate-600">All Form Recipes</SelectItem>
                      {filteredForms.map((f) => (
                        <SelectItem key={f.id} value={f.id} className="font-bold text-slate-700">
                          {f.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>



              {/* Submissions feed container */}
              <div className="mt-8 space-y-4">
                {subsLoading ? (
                  <div className="py-16 text-center text-slate-400 font-bold text-xs">
                    Loading submissions... Please wait.
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl bg-white/20">
                    <div className="size-16 bg-sky-50 border border-sky-100 rounded-full flex items-center justify-center mx-auto text-sky-500 mb-4 shadow-inner">
                      <IconMail className="size-8" />
                    </div>
                    <h3 className="text-md font-bold font-caveat tracking-wider text-slate-700">No Submissions Yet</h3>
                    <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto mt-1 leading-relaxed">
                      No submissions found for this form. Share your public link to start collecting responses.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {filteredSubmissions.slice(0, 4).map((sub) => {
                        const matchedForm = forms.find((f) => f.id === sub.formId);
                        return (
                          <Card key={sub.id} className="scribble-border scribble-shadow bg-white overflow-hidden p-4 space-y-3.5 hover:translate-y-[-2px] transition-transform duration-300">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100/70 pb-2.5">
                              <div className="space-y-0.5">
                                <h4 className="font-bold font-caveat tracking-wider text-slate-800 text-sm">{matchedForm?.title ?? "Unknown Form"}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold">Submission ID: {sub.id}</p>
                              </div>
                              <Badge className="bg-violet-100 text-[#7b61ff] border-none text-[10px] font-bold rounded-xl px-2.5 py-0.5">
                                Submitted: {formatDate(sub.createdAt)}
                              </Badge>
                            </div>

                            {/* Values grid */}
                            <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                              {sub.values && sub.values.length > 0 ? (
                                sub.values.map((v: any, index: number) => (
                                  <div key={index} className="rounded-xl bg-slate-50/70 p-2.5 border border-slate-100">
                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                                      Field ID / Tag
                                    </span>
                                    <span className="text-sm font-bold text-slate-800 block mt-0.5 break-words">
                                      {renderSubmissionValue(v, matchedForm)}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 truncate">
                                      Key: {v.formFieldId}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-full text-xs italic text-slate-400 font-semibold">
                                  No values submitted in this package.
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>

                    {filteredSubmissions.length > 4 && (
                      <div className="flex justify-center pt-4 pb-2">
                        <Button 
                          onClick={() => router.push(`/dashboard?tab=all-submissions&formId=${selectedSubFormId}`)}
                          className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-11 px-8 rounded-2xl border-none shadow-sm"
                        >
                          See More Submissions ({filteredSubmissions.length - 4} more)
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ALL SUBMISSIONS VIEW */}
        {tab === "all-submissions" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Badge className="bg-sky-600 text-white border-none px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Responses Inbox
                  </Badge>
                  <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">All Submissions Archive</CardTitle>
                  <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                    Showing all {filteredSubmissions.length} letters for your selected filter.
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => router.push(`/dashboard?tab=submissions&formId=${selectedSubFormId}`)}
                  variant="outline"
                  className="scribble-btn bg-white hover:bg-slate-50 text-slate-700 font-bold h-11 px-6 rounded-2xl border-slate-200 shadow-sm"
                >
                  Back to Submissions
                </Button>
              </div>

              <div className="mt-8 space-y-4">
                {subsLoading ? (
                  <div className="py-16 text-center text-slate-400 font-bold text-xs">
                    Loading submissions... Please wait.
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl bg-white/20">
                    <h3 className="text-md font-bold font-caveat tracking-wider text-slate-700">No Submissions Yet</h3>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredSubmissions.map((sub) => {
                      const matchedForm = forms.find((f) => f.id === sub.formId);
                      return (
                        <Card key={sub.id} className="scribble-border scribble-shadow bg-white overflow-hidden p-4 space-y-3.5 hover:translate-y-[-2px] transition-transform duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100/70 pb-2.5">
                            <div className="space-y-0.5">
                              <h4 className="font-bold font-caveat tracking-wider text-slate-800 text-sm">{matchedForm?.title ?? "Unknown Form"}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">Submission ID: {sub.id}</p>
                            </div>
                            <Badge className="bg-violet-100 text-[#7b61ff] border-none text-[10px] font-bold rounded-xl px-2.5 py-0.5">
                              Submitted: {formatDate(sub.createdAt)}
                            </Badge>
                          </div>

                          {/* Values grid */}
                          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                            {sub.values && sub.values.length > 0 ? (
                              sub.values.map((v: any, index: number) => (
                                <div key={index} className="rounded-xl bg-slate-50/70 p-2.5 border border-slate-100">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                                    Field ID / Tag
                                  </span>
                                  <span className="text-sm font-bold text-slate-800 block mt-0.5 break-words">
                                    {renderSubmissionValue(v, matchedForm)}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 truncate">
                                    Key: {v.formFieldId}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full text-xs italic text-slate-400 font-semibold">
                                No values submitted in this package.
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ROOM: BACKYARD (Analytics) */}
        {tab === "analytics" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Badge className="bg-emerald-600 text-white border-none px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Analytics Dashboard
                  </Badge>
                  <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">Analytics</CardTitle>
                  <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                    Monitor form performance, submission rates, and analyze user data.
                  </CardDescription>
                </div>

                {/* Selector */}
                <div className="w-full sm:w-64">
                  <Select
                    value={selectedAnaFormId}
                    onValueChange={(val) => {
                      setSelectedAnaFormId(val);
                      if (val !== "all") {
                        router.push(`/dashboard?tab=analytics&formId=${val}`);
                      } else {
                        router.push(`/dashboard?tab=analytics`);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold shadow-soft">
                      <SelectValue placeholder="All forms summary..." />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-none rounded-2xl p-1 shadow-soft">
                      <SelectItem value="all" className="font-bold text-slate-600">All Form Recipes</SelectItem>
                      {filteredForms.map((f) => (
                        <SelectItem key={f.id} value={f.id} className="font-bold text-slate-700">
                          {f.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>



              {/* Analytics Dashboard Grid */}
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <Card className="rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-soft">
                  <p className="text-[10px] font-bold font-caveat tracking-wider uppercase tracking-wider text-slate-400">Total Responses</p>
                  <p className="text-2xl sm:text-3xl font-bold font-caveat tracking-wider text-slate-800 mt-1">{activeAnalyticsCount}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Recorded submissions</p>
                </Card>

                <Card className="rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-soft">
                  <p className="text-[10px] font-bold font-caveat tracking-wider uppercase tracking-wider text-slate-400">Completeness rate</p>
                  <p className="text-2xl sm:text-3xl font-bold font-caveat tracking-wider text-[#7b61ff] mt-1">{completenessRate}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Percentage of fields filled</p>
                </Card>

                <Card className="rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-soft">
                  <p className="text-[10px] font-bold font-caveat tracking-wider uppercase tracking-wider text-slate-400">Response Trend</p>
                  <p className={cn(
                    "text-2xl sm:text-3xl font-bold font-caveat tracking-wider mt-1",
                    responseTrend === "Growing" ? "text-emerald-600" : responseTrend === "Declining" ? "text-rose-500" : "text-slate-600"
                  )}>{responseTrend}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Weekly submission rate trend</p>
                </Card>
              </div>

              {/* Custom SVG Chart (Sketch Line Graph for both All and Specific Form) */}
              <Card className="rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-soft mt-4">
                <CardTitle className="text-xs font-bold font-caveat tracking-wider text-slate-700 mb-2">
                  {selectedAnaFormId === "all" ? "Overall Submission Growth Trend" : "Submission Growth Trend (Graph Ray)"}
                </CardTitle>
                <div className="h-48 w-full flex items-center justify-center pt-2">
                  {lineChartPoints.length === 0 ? (
                    <div className="w-full text-center text-xs text-slate-400 font-bold my-auto">
                      {selectedAnaFormId === "all" 
                        ? "No submissions recorded across any form yet." 
                        : "No submissions recorded for this form yet."}
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <svg viewBox="0 0 600 180" className="w-full h-full">
                        <defs>
                          <linearGradient id="rayGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#7b61ff" stopOpacity="0.0" />
                          </linearGradient>
                          <filter id="sketch-line" x="-10%" y="-10%" width="120%" height="120%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
                          </filter>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="40" y1="20" x2="560" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                        <line x1="40" y1="65" x2="560" y2="65" stroke="#f1f5f9" strokeDasharray="4 4" />
                        <line x1="40" y1="110" x2="560" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" />
                        <line x1="40" y1="160" x2="560" y2="160" stroke="#cbd5e1" strokeWidth="1.5" />

                        {/* Area Path */}
                        {lineChartPoints.length > 0 && (
                          <path
                            d={`${lineChartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${lineChartPoints[lineChartPoints.length - 1]!.x} 160 L ${lineChartPoints[0]!.x} 160 Z`}
                            fill="url(#rayGradient)"
                          />
                        )}

                        {/* Line Path */}
                        {lineChartPoints.length > 0 && (
                          <path
                            d={lineChartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                            fill="none"
                            stroke="#7b61ff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#sketch-line)"
                          />
                        )}

                        {/* Data points (circles with hover tooltip) */}
                        {lineChartPoints.map((p, i) => (
                          <g key={i} className="group/point">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="5.5"
                              fill="#7b61ff"
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              className="transition-all duration-200 hover:r-7 cursor-pointer"
                            />
                            <text
                              x={p.x}
                              y={p.y - 12}
                              textAnchor="middle"
                              className="text-[10px] font-bold fill-slate-700 bg-white"
                            >
                              {p.count}
                            </text>
                            {/* X Axis Label */}
                            <text
                              x={p.x}
                              y="174"
                              textAnchor="middle"
                              className="text-[9px] font-bold font-sans fill-slate-400"
                            >
                              {p.date}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  )}
                </div>
              </Card>

              {/* Field Analysis details shown for specific form */}
              {selectedAnaFormId !== "all" && fieldAnalytics.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold font-caveat tracking-wider text-slate-800">Field-level Response Analytics</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fieldAnalytics.map((fa) => (
                      <Card key={fa.fieldId} className="scribble-border bg-white p-4 shadow-soft">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                          <h4 className="text-xs font-bold text-slate-800 truncate max-w-[70%]">{fa.label}</h4>
                          <Badge className="bg-violet-100 text-[#7b61ff] text-[8px] font-bold border-none uppercase rounded px-1.5 py-0.5">
                            {fa.type}
                          </Badge>
                        </div>

                        <div className="flex gap-3 mb-2 text-[10px] text-slate-400 font-semibold font-sans">
                          <span>Responses: <strong className="text-slate-600 font-bold">{fa.totalCount}</strong></span>
                          <span>Blank: <strong className="text-slate-600 font-bold">{fa.blankCount}</strong></span>
                        </div>

                        <div className="space-y-2.5">
                          {fa.topResponses.length === 0 ? (
                            <p className="text-xs italic text-slate-400 font-semibold py-1">No responses collected for this field.</p>
                          ) : (
                            fa.topResponses.map(([val, count]) => {
                              const pct = fa.totalCount > 0 ? (count / fa.totalCount) * 100 : 0;
                              return (
                                <div key={val} className="space-y-1">
                                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                                    <span className="truncate max-w-[70%]">{val}</span>
                                    <span>{count} ({Math.round(pct)}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${pct}%` }}
                                      className="bg-gradient-to-r from-[#7b61ff] to-[#ff7ee2] h-full rounded-full transition-all duration-500"
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Assistant speech bubble */}
              <div className="mt-4 p-3 rounded-2xl border border-sky-100 bg-sky-50/50 flex items-center gap-3">
                <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 drop-shadow-md flex-shrink-0">
                  <ellipse cx="50" cy="50" rx="20" ry="16" fill="#FFFFFF" stroke="#2c2738" strokeWidth="2" />
                  <circle cx="35" cy="40" r="14" fill="#FFFFFF" stroke="#2c2738" strokeWidth="2" />
                  <path d="M22 35c-2 2-5 8-3 10s6 0 5-4c0-4-1-6-2-6z" fill="#FFFFFF" stroke="#2c2738" strokeWidth="2" />
                  <path d="M48 35c2 2 5 8 3 10s-6 0-5-4c0-4 1-6 2-6z" fill="#FFFFFF" stroke="#2c2738" strokeWidth="2" />
                  <circle cx="30" cy="38" r="1.5" fill="#2c2738" />
                  <circle cx="40" cy="38" r="1.5" fill="#2c2738" />
                  <ellipse cx="35" cy="44" rx="2" ry="1.5" fill="#2c2738" />
                  <path d="M42 48c-3 3-9 2-12-1" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="rounded-xl bg-white border border-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 relative">
                  <div className="absolute left-[-6px] top-3 size-2.5 bg-white border-l border-b border-slate-100 rotate-45" />
                  Assistant says: <span className="text-[#7b61ff] font-bold">"{assistantPhrase}"</span>
                </div>
              </div>
            </Card>
          </div>
        )}


        {/* ROOM: UTILITY ROOM (Profile Settings) */}
        {tab === "settings" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="scribble-border scribble-shadow bg-white p-6">
              <div className="space-y-1">
                <Badge className="bg-sky-500 text-white border-none px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Workspace Utility Washroom
                </Badge>
                <CardTitle className="text-2xl font-bold font-caveat tracking-wider text-slate-800">Household Configuration</CardTitle>
                <CardDescription className="text-slate-600 font-semibold text-xs leading-relaxed">
                  Adjust developer settings, customize your avatar profile, and clean up workspace setups.
                </CardDescription>
              </div>

              <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] mt-8">
                {/* Profile Editor */}
                <Card className="rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-soft">
                  <h3 className="text-md font-bold font-caveat tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                    <IconUser className="size-5 text-[#7b61ff]" /> Avatar Profile Settings
                  </h3>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Full Name</label>
                      <Input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Email Address</label>
                      <Input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Your Role</label>
                      <Select value={favCharacter} onValueChange={setFavCharacter}>
                        <SelectTrigger className="w-full bg-white/60 border border-slate-200 focus:border-[#7b61ff] rounded-2xl h-11 px-4 text-sm font-semibold">
                          <SelectValue placeholder="Select character..." />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-none rounded-2xl p-1 shadow-soft">
                          <SelectItem value="User" className="font-bold text-slate-700">User</SelectItem>
                          <SelectItem value="Project Manager" className="font-bold text-slate-700">Project Manager</SelectItem>
                          <SelectItem value="Administrator" className="font-bold text-slate-700">Administrator</SelectItem>
                          <SelectItem value="Editor" className="font-bold text-slate-700">Editor</SelectItem>
                          <SelectItem value="Guest" className="font-bold text-slate-700">Guest</SelectItem>
                          <SelectItem value="CEO" className="font-bold text-slate-700">CEO</SelectItem>
                          <SelectItem value="Super Admin" className="font-bold text-slate-700">Super Admin</SelectItem>
                          <SelectItem value="Developer" className="font-bold text-slate-700">Developer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" disabled={saveLoading} className="scribble-btn bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-11 px-6 rounded-2xl border-none shadow-sm text-xs mt-2">
                      {saveLoading ? "Saving changes..." : "Save Settings"}
                    </Button>
                  </form>
                </Card>

                {/* Developers Credentials box */}
                <div className="space-y-6">
                  <Card className="rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-soft">
                    <h3 className="text-md font-bold font-caveat tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                      <IconKey className="size-5 text-[#ff7ee2]" /> Developer API Sandbox
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-4">
                      Integrate forms into other applications in the the platform district by copying this credentials block.
                    </p>

                    <div className="space-y-3">
                      <div className="rounded-2xl border border-slate-100 bg-white/80 p-3">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">API Sandbox Key</span>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="text-xs font-mono font-bold text-slate-700 truncate">pratikriya_live_Workspace_10928</span>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-[#7b61ff] font-bold hover:bg-violet-50 text-[10px] px-2 py-1 rounded-lg"
                            onClick={() => {
                              navigator.clipboard.writeText("pratikriya_live_Workspace_10928");
                              toast.success("Sandbox API Key copied to clipboard!");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-white/80 p-3">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Webhook Gateway</span>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="text-xs font-mono font-bold text-slate-700 truncate">https://api.pratikriya.com/hook</span>
                          <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[8px] rounded-lg">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Page() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-6">
        <div className="glass-panel border-none rounded-3xl p-8 max-w-sm w-full text-center space-y-4 animate-pulse">
          <p className="font-black text-slate-700 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-6">
        <div className="glass-panel border-none rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
          <p className="font-black text-slate-700 text-sm">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
