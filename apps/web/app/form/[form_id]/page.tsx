"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetFormByFormId } from '~/hooks/api/form';
import { useCreateSubmission } from '~/hooks/api/form-submission';
import { useUser, useSignOut } from '~/hooks/api/auth';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '~/components/ui/select';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { 
  Loader2, 
  AlertCircle, 
  Check, 
  User, 
  Mail, 
  RefreshCw, 
  Send,
  HelpCircle,
  FileText,
  Home,
  LogOut,
  Upload,
  X,
  Trash2
} from 'lucide-react';

const isFieldVisible = (field: any, allFields: any[], values: Record<string, string>): boolean => {
	const config = (() => {
		try {
			return field.configuration ? JSON.parse(field.configuration) : {};
		} catch {
			return {};
		}
	})();

	if (config.hidden) {
		return false;
	}

	const cond = config.conditionalLogic;
	if (cond && cond.showIfField) {
		const triggerField = allFields.find((f: any) => f.id === cond.showIfField);
		if (!triggerField) return false;

		// Check recursively if the trigger field itself is visible
		if (!isFieldVisible(triggerField, allFields, values)) {
			return false;
		}

		const parentValue = values[cond.showIfField] || '';
		const targetValue = cond.showIfValue || '';

		const normParent = parentValue.trim().toLowerCase();
		const normTarget = targetValue.trim().toLowerCase();

		if (normParent !== normTarget) {
			if (triggerField.type === 'CHECKBOX') {
				const list = parentValue.split(',').map((s: string) => s.trim().toLowerCase());
				if (list.includes(normTarget)) {
					return true;
				}
			}
			return false;
		}
	}

	return true;
};

const isAddressEmpty = (val: string, shownFields: any): boolean => {
	try {
		const data = JSON.parse(val || '{}');
		const fieldsToCheck = ['street', 'city', 'state', 'zip', 'country'];
		for (const f of fieldsToCheck) {
			if (shownFields[f] !== false && (!data[f] || !data[f].trim())) {
				return true;
			}
		}
		return false;
	} catch {
		return true;
	}
};

export default function Page() {
	const params = useParams() as { form_id?: string } | null;
	const formId = params?.form_id;

	const { form, isLoading, isError, refetch } = useGetFormByFormId(formId);
	const { createSubmissionAsync, isPending } = useCreateSubmission();
	const { user } = useUser();
	const { signOutUserAsync } = useSignOut();

	const [values, setValues] = useState<Record<string, string>>({});
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [activeTermsContent, setActiveTermsContent] = useState<string | null>(null);
	const [activeTermsTitle, setActiveTermsTitle] = useState<string>('');

	const getInitialValues = (fields: any[]) => {
		const initial: Record<string, string> = {};
		fields.forEach((f: any) => {
			const config = (() => {
				try {
					return f.configuration ? JSON.parse(f.configuration) : {};
				} catch {
					return {};
				}
			})();
			
			if (f.type === 'RATING' && config.defaultRating !== undefined && config.defaultRating !== null) {
				initial[f.id] = String(config.defaultRating);
			} else if (f.type === 'TEXT' && config.defaultValue !== undefined && config.defaultValue !== null) {
				initial[f.id] = String(config.defaultValue);
			} else if ((f.type === 'DROPDOWN' || f.type === 'RADIO') && config.defaultOption !== undefined && config.defaultOption !== null) {
				initial[f.id] = String(config.defaultOption);
			} else {
				initial[f.id] = '';
			}
		});
		return initial;
	};

	const resetToForm = () => {
		setSubmitSuccess(false);
		setSubmitError(null);
		if (form?.fields) {
			setValues(getInitialValues(form.fields));
		}
	};

	const handleSwitchAccount = () => {
		// Redirect instantly — fire sign-out in background
		window.location.href = `/login?redirect=/form/${formId}`;
		signOutUserAsync({}).catch(console.error);
	};

	useEffect(() => {
		if (form?.fields) {
			setValues(getInitialValues(form.fields));
		}
	}, [form?.id]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#fbfaf5] flex items-center justify-center p-6 scribble-bg">
				<div className="bg-white border-4 border-foreground rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-[6px_6px_0px_#000]">
					<Loader2 className="size-10 animate-spin text-[#7b61ff] mx-auto" />
					<p className="font-patrick-hand text-base font-bold text-slate-700">Opening form drawer...</p>
				</div>
			</div>
		);
	}

	if (isError || !form) {
		return (
			<div className="min-h-screen bg-[#fbfaf5] flex items-center justify-center p-6 scribble-bg">
				<div className="bg-white border-4 border-foreground rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-[6px_6px_0px_#000]">
					<div className="size-14 bg-rose-100 border-2 border-foreground rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-[2px_2px_0px_#000]">
						<AlertCircle className="size-7" />
					</div>
					<h2 className="text-xl font-bold font-caveat tracking-wide text-slate-800">Form Not Found</h2>
					<p className="text-sm text-slate-600 font-patrick-hand leading-relaxed">
						We searched our records but couldn't find this form. Please check the link and try again!
					</p>
					<Button asChild className="border-2 border-foreground shadow-[2.5px_2.5px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs font-bold bg-pastel-yellow text-foreground rounded-xl h-9">
						<Link href="/">Back to Home</Link>
					</Button>
				</div>
			</div>
		);
	}

	if (!form.acceptsResponses) {
		return (
			<div className="min-h-screen bg-[#fbfaf5] flex items-center justify-center p-6 scribble-bg">
				<div className="bg-white border-4 border-foreground rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-[8px_8px_0px_#000] relative flex flex-col items-center">
					<img 
						src="https://api.dicebear.com/7.x/open-peeps/png?seed=Closed&size=144" 
						alt="Closed avatar" 
						className="size-36 mx-auto opacity-90 animate-bounce pointer-events-none mb-2" 
					/>
					
					<span className="text-[10px] font-bold px-3 py-0.5 bg-rose-100 text-rose-700 border-2 border-foreground rounded-full shadow-[1.5px_1.5px_0px_#000] uppercase tracking-wider">
						Mailbox Closed
					</span>
					<h2 className="text-2xl font-bold font-caveat text-slate-800 mt-2">Oops! Responses are Closed</h2>
					<p className="text-xs text-slate-500 font-patrick-hand leading-relaxed">
						The form owner is not accepting any more submissions at this time.
					</p>
					<div className="flex gap-2 pt-2">
						<Button onClick={() => refetch?.()} className="bg-pastel-blue hover:bg-blue-100 text-[#2d2638] font-bold h-9 text-xs rounded-xl border-2 border-foreground shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all flex items-center gap-1">
							<RefreshCw className="size-3.5" /> Check Status
						</Button>
						<Button asChild variant="outline" className="bg-white hover:bg-slate-50 text-[#2d2638] font-bold h-9 text-xs rounded-xl border-2 border-foreground shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all">
							<Link href="/">Back Home</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const handleChange = (id: string, v: string) => {
		setValues((s) => ({ ...s, [id]: v }));
		if (errors[id]) {
			setErrors((errs) => {
				const copy = { ...errs };
				delete copy[id];
				return copy;
			});
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError(null);
		setSubmitSuccess(false);

		// Perform visibility-aware client-side validation
		const newErrors: Record<string, string> = {};
		form.fields.forEach((field: any) => {
			if (!isFieldVisible(field, form.fields, values)) {
				return; // Skip hidden/inactive fields
			}

			const config = (() => {
				try {
					return field.configuration ? JSON.parse(field.configuration) : {};
				} catch {
					return {};
				}
			})();

			const val = values[field.id] || '';

			// 1. Required validation
			if (field.isRequired) {
				let isEmpty = false;
				if (field.type === 'ADDRESS') {
					const shown = config.shownFields || { street: true, city: true, state: true, country: true, zip: true };
					isEmpty = isAddressEmpty(val, shown);
				} else if (field.type === 'CHECKBOX') {
					const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : []);
					if (opts.length > 0) {
						isEmpty = !val.trim();
					} else {
						isEmpty = val !== 'Checked';
					}
				} else if (field.type === 'TERMS') {
					isEmpty = val !== 'Accepted';
				} else {
					isEmpty = !val.trim();
				}

				if (isEmpty) {
					newErrors[field.id] = `${field.label} is required.`;
					return;
				}
			}

			// 2. Custom validation rules based on configuration
			if (val.trim()) {
				if (field.type === 'TEXT') {
					if (config.minLength && val.length < Number(config.minLength)) {
						newErrors[field.id] = `${field.label} must be at least ${config.minLength} characters.`;
					} else if (config.maxLength && val.length > Number(config.maxLength)) {
						newErrors[field.id] = `${field.label} cannot exceed ${config.maxLength} characters.`;
					}
				} else if (field.type === 'TEXTAREA') {
					if (config.charLimit && val.length > Number(config.charLimit)) {
						newErrors[field.id] = `${field.label} cannot exceed ${config.charLimit} characters.`;
					}
				} else if (field.type === 'DATE') {
					if (config.minDate && val < config.minDate) {
						newErrors[field.id] = `Date must be on or after ${config.minDate}.`;
					} else if (config.maxDate && val > config.maxDate) {
						newErrors[field.id] = `Date must be on or before ${config.maxDate}.`;
					}
				}
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			const firstErrorId = Object.keys(newErrors)[0];
			if (firstErrorId) {
				const el = document.getElementById(firstErrorId);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}
			setSubmitError('Please fix the validation errors before submitting.');
			return;
		}

		setErrors({});

		const payloadValues = form.fields
			.filter((field: any) => isFieldVisible(field, form.fields, values))
			.map((field: any) => ({
				formFieldId: field.id,
				value: values[field.id] ?? '',
			}));

		void (async () => {
			try {
				await createSubmissionAsync({ formId: form.id, values: payloadValues });
				setSubmitSuccess(true);
				setValues({});
			} catch (error: any) {
				setSubmitError(error?.message || 'Failed to submit form');
			}
		})();
	};

	const renderInput = (field: any) => {
		const config = (() => {
			try {
				return field.configuration ? JSON.parse(field.configuration) : {};
			} catch {
				return {};
			}
		})();

		const common = {
			id: field.id,
			value: values[field.id] ?? '',
			onChange: (e: any) => handleChange(field.id, e.target.value),
			required: field.isRequired,
			placeholder: field.placeholder || 'Enter response...',
			readOnly: !!config.readOnly,
			disabled: !!config.readOnly,
			className: `w-full bg-white border-2 border-foreground rounded-xl h-11 px-4 text-xs font-bold shadow-[2px_2px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all font-patrick-hand placeholder-slate-400 ${config.cssClass || ''}`,
		} as any;

		switch (field.type) {
			case 'NUMBER':
				return <Input type="number" {...common} />;
			case 'EMAIL':
				return <Input type="email" {...common} />;
			case 'PASSWORD':
				return <Input type="password" {...common} />;
			case 'YES_NO':
				return (
					<Select onValueChange={(v) => handleChange(field.id, v)} value={values[field.id] ?? ''} disabled={!!config.readOnly}>
						<SelectTrigger className="w-full bg-white border-2 border-foreground rounded-xl h-11 px-4 text-xs font-bold shadow-[2px_2px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all font-patrick-hand">
							<SelectValue placeholder="Select option..." />
						</SelectTrigger>
						<SelectContent className="bg-white border-2 border-foreground rounded-xl p-1 shadow-[3px_3px_0px_#000]">
							<SelectItem value="yes" className="font-bold font-patrick-hand text-slate-700 text-xs">Yes</SelectItem>
							<SelectItem value="no" className="font-bold font-patrick-hand text-slate-700 text-xs">No</SelectItem>
						</SelectContent>
					</Select>
				);
			case 'PDF':
				return (
					<PdfUploadInput
						fieldId={field.id}
						value={values[field.id]}
						onChange={(url) => handleChange(field.id, url)}
						required={field.isRequired}
						placeholder={field.placeholder || undefined}
						disabled={!!config.readOnly}
					/>
				);
			case 'IMAGE':
				return (
					<ImageUploadInput
						fieldId={field.id}
						value={values[field.id]}
						onChange={(url) => handleChange(field.id, url)}
						required={field.isRequired}
						placeholder={field.placeholder || undefined}
						disabled={!!config.readOnly}
					/>
				);
			case 'MULTIPLE_IMAGES':
				return (
					<MultipleImagesUploadInput
						fieldId={field.id}
						value={values[field.id]}
						onChange={(urls) => handleChange(field.id, urls)}
						required={field.isRequired}
						placeholder={field.placeholder || undefined}
						disabled={!!config.readOnly}
					/>
				);
			case 'TEXTAREA':
				return (
					<div className="flex flex-col gap-1 w-full">
						<Textarea 
							{...common} 
							rows={config.rows ? Number(config.rows) : 4} 
							maxLength={config.charLimit ? Number(config.charLimit) : undefined}
							className="w-full bg-white border-2 border-foreground rounded-xl p-4 text-xs font-bold shadow-[2px_2px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all min-h-[100px] font-patrick-hand placeholder-slate-400" 
						/>
						{config.charLimit && (
							<p className="text-[10px] font-bold text-slate-400 text-right font-patrick-hand mr-1">
								{(values[field.id] || '').length} / {config.charLimit} characters
							</p>
						)}
					</div>
				);
			case 'PHONE':
				return (
					<div className="flex gap-2 items-center w-full">
						<div className="bg-white border-2 border-foreground rounded-xl h-11 px-3 flex items-center justify-center font-bold font-patrick-hand text-xs shadow-[2px_2px_0px_#000] text-slate-700 shrink-0">
							{config.countryCode || '+91'}
						</div>
						<Input type="tel" placeholder={field.placeholder || 'e.g. 555-000-0000'} {...common} />
					</div>
				);
			case 'DROPDOWN': {
				const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : ['India', 'USA', 'Canada']);
				return (
					<Select onValueChange={(v) => handleChange(field.id, v)} value={values[field.id] ?? ''} disabled={!!config.readOnly}>
						<SelectTrigger className="w-full bg-white border-2 border-foreground rounded-xl h-11 px-4 text-xs font-bold shadow-[2px_2px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all font-patrick-hand">
							<SelectValue placeholder="Select option..." />
						</SelectTrigger>
						<SelectContent className="bg-white border-2 border-foreground rounded-xl p-1 shadow-[3px_3px_0px_#000]">
							{opts.map((opt: string, idx: number) => (
								<SelectItem key={idx} value={opt} className="font-bold font-patrick-hand text-slate-700 text-xs">
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			}
			case 'CHECKBOX': {
				const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : []);
				if (opts.length > 0) {
					const valStr = values[field.id];
					const selectedList = valStr ? valStr.split(',').map((s: string) => s.trim()) : [];
					const handleCheckboxChange = (opt: string, checked: boolean) => {
						if (config.readOnly) return;
						let updated;
						if (checked) {
							updated = [...selectedList, opt];
						} else {
							updated = selectedList.filter((o) => o !== opt);
						}
						handleChange(field.id, updated.join(', '));
					};
					return (
						<div className="flex flex-col gap-2.5">
							{opts.map((opt: string, idx: number) => {
								const isChecked = selectedList.includes(opt);
								return (
									<label key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer font-patrick-hand select-none">
										<Checkbox
											checked={isChecked}
											onCheckedChange={(val) => handleCheckboxChange(opt, val === true)}
											disabled={!!config.readOnly}
											className="border-2 border-foreground rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-5 shadow-[1px_1px_0px_#000]"
										/>
										{opt}
									</label>
								);
							})}
						</div>
					);
				} else {
					const isChecked = values[field.id] === 'Checked';
					return (
						<label className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer font-patrick-hand select-none">
							<Checkbox
								checked={isChecked}
								onCheckedChange={(val) => {
									if (config.readOnly) return;
									handleChange(field.id, val ? 'Checked' : 'Unchecked');
								}}
								disabled={!!config.readOnly}
								className="border-2 border-foreground rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-5 shadow-[1px_1px_0px_#000]"
							/>
							{field.placeholder || 'Select this checkbox'}
						</label>
					);
				}
			}
			case 'RADIO': {
				const opts = config.options || (field.placeholder ? field.placeholder.split(',').map((o: string) => o.trim()) : ['Male', 'Female', 'Other']);
				const selected = values[field.id] ?? '';
				return (
					<RadioGroup
						value={selected}
						onValueChange={(val) => {
							if (config.readOnly) return;
							handleChange(field.id, val);
						}}
						disabled={!!config.readOnly}
						className="flex flex-col gap-2.5"
					>
						{opts.map((opt: string, idx: number) => (
							<label
								key={idx}
								className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer font-patrick-hand select-none"
							>
								<RadioGroupItem
									value={opt}
									disabled={!!config.readOnly}
									className="border-2 border-foreground rounded-full size-5 shadow-[1px_1px_0px_#000] bg-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[#7b61ff]"
								/>
								{opt}
							</label>
						))}
					</RadioGroup>
				);
			}
			case 'DATE':
				return (
					<Input 
						type="date" 
						min={config.minDate || undefined} 
						max={config.maxDate || undefined} 
						{...common} 
					/>
				);
			case 'RATING':
				return (
					<StarRatingInput
						value={values[field.id]}
						onChange={(val) => handleChange(field.id, val)}
						maxStars={config.maxStars ? Number(config.maxStars) : 5}
						disabled={!!config.readOnly}
					/>
				);
			case 'SIGNATURE':
				return (
					<SignaturePadInput
						fieldId={field.id}
						value={values[field.id]}
						onChange={(url) => handleChange(field.id, url)}
						height={config.height ? Number(config.height) : 120}
						disabled={!!config.readOnly}
					/>
				);
			case 'ADDRESS':
				return (
					<AddressInput
						value={values[field.id]}
						onChange={(address) => handleChange(field.id, address)}
						shownFields={config.shownFields || { street: true, city: true, state: true, country: true, zip: true }}
						disabled={!!config.readOnly}
					/>
				);
			case 'TERMS': {
				const isChecked = values[field.id] === 'Accepted';
				return (
					<label className="flex items-start gap-3 text-xs font-bold text-slate-700 cursor-pointer font-patrick-hand select-none leading-relaxed">
						<Checkbox
							checked={isChecked}
							onCheckedChange={(val) => {
								if (config.readOnly) return;
								handleChange(field.id, val ? 'Accepted' : 'Declined');
							}}
							disabled={!!config.readOnly}
							className="border-2 border-foreground rounded-md data-[state=checked]:bg-[#7b61ff] data-[state=checked]:text-white size-5 shadow-[1px_1px_0px_#000] mt-0.5 shrink-0"
						/>
						<span>
							{config.termsText || field.placeholder || 'I agree to the Terms & Conditions and Privacy Policy.'}
							{(config.termsUrl || config.termsContent) && (
								<>
									{' '}
									<button
										type="button"
										className="text-[#7b61ff] underline hover:text-[#684ff0] font-bold ml-1 cursor-pointer focus:outline-none"
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											if (config.termsContent) {
												setActiveTermsContent(config.termsContent);
												setActiveTermsTitle(config.termsText || field.label);
											} else if (config.termsUrl) {
												window.open(config.termsUrl, '_blank');
											}
										}}
									>
										(Read Terms)
									</button>
								</>
							)}
						</span>
					</label>
				);
			}
			default:
				if (field.type === 'TEXTAREA' || (field.placeholder && field.placeholder.length > 80)) {
					return <Textarea {...common} className="w-full bg-white border-2 border-foreground rounded-xl p-4 text-xs font-bold shadow-[2px_2px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all min-h-[100px] font-patrick-hand placeholder-slate-400" />;
				}
				return <Input type="text" {...common} />;
		}
	};

	return (
		<div className="min-h-screen bg-[#fbfaf5] flex flex-col items-center justify-center p-4 md:p-8 relative scribble-bg">
			
			<div className="w-full max-w-xl relative mt-16 mb-10">
				
				{/* Peek-a-boo Mascot illustration sticking from behind notepad */}
				{!submitSuccess && (
					<div className="absolute -top-[94px] right-6 size-24 pointer-events-none hidden sm:block">
						<svg
							viewBox="0 0 120 140"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full drop-shadow-md rotate-[-8deg]"
							aria-label="Form mascot"
						>
							{/* Body */}
							<ellipse cx="60" cy="105" rx="28" ry="30" fill="#7b61ff" stroke="#2d2638" strokeWidth="3"/>
							{/* Shirt detail */}
							<ellipse cx="60" cy="110" rx="18" ry="20" fill="#b56cff" stroke="#2d2638" strokeWidth="2"/>
							{/* Left arm */}
							<path d="M33 95 Q18 88 20 75" stroke="#7b61ff" strokeWidth="8" strokeLinecap="round" fill="none"/>
							{/* Right arm waving */}
							<path d="M87 95 Q105 82 100 68" stroke="#7b61ff" strokeWidth="8" strokeLinecap="round" fill="none"/>
							{/* Hand waving */}
							<circle cx="100" cy="65" r="7" fill="#ffd6c0" stroke="#2d2638" strokeWidth="2"/>
							{/* Head */}
							<ellipse cx="60" cy="58" rx="26" ry="28" fill="#ffd6c0" stroke="#2d2638" strokeWidth="3"/>
							{/* Hair */}
							<ellipse cx="60" cy="33" rx="26" ry="12" fill="#2d2638"/>
							<ellipse cx="38" cy="42" rx="8" ry="14" fill="#2d2638"/>
							<ellipse cx="82" cy="42" rx="8" ry="14" fill="#2d2638"/>
							{/* Eyes */}
							<ellipse cx="50" cy="56" rx="5" ry="6" fill="white" stroke="#2d2638" strokeWidth="1.5"/>
							<ellipse cx="70" cy="56" rx="5" ry="6" fill="white" stroke="#2d2638" strokeWidth="1.5"/>
							<circle cx="51" cy="57" r="3" fill="#2d2638"/>
							<circle cx="71" cy="57" r="3" fill="#2d2638"/>
							{/* Eye shine */}
							<circle cx="52.5" cy="55.5" r="1" fill="white"/>
							<circle cx="72.5" cy="55.5" r="1" fill="white"/>
							{/* Big smile */}
							<path d="M47 67 Q60 78 73 67" stroke="#2d2638" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
							{/* Blush cheeks */}
							<ellipse cx="43" cy="65" rx="6" ry="4" fill="#ff7ee2" opacity="0.5"/>
							<ellipse cx="77" cy="65" rx="6" ry="4" fill="#ff7ee2" opacity="0.5"/>
						</svg>
					</div>
				)}

				{submitSuccess ? (
					<div className="bg-white border-4 border-foreground rounded-3xl p-8 md:p-10 shadow-[8px_8px_0px_#000] text-center space-y-6 animate-in zoom-in-95 duration-200">
						<div className="size-16 bg-emerald-100 border-2 border-foreground rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-[3px_3px_0px_#000]">
							<Check className="size-8" />
						</div>
						
						<div className="space-y-2">
							<span className="inline-block text-[10px] font-bold px-3 py-0.5 bg-emerald-100 text-emerald-800 border-2 border-foreground rounded-full shadow-[1.5px_1.5px_0px_#000] uppercase tracking-wider">
								Delivered successfully!
							</span>
							<h1 className="text-3xl font-bold font-caveat text-slate-800 tracking-tight leading-none mt-2">
								Response Submitted!
							</h1>
							<p className="text-sm text-slate-600 font-patrick-hand leading-relaxed max-w-sm mx-auto">
								Your response has been securely saved to the database. Thank you for your feedback!
							</p>
						</div>
						
						<div className="flex flex-col gap-2.5 pt-4">
							<Button
								onClick={resetToForm}
								className="w-full bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-11 rounded-xl border-2 border-foreground shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs flex items-center justify-center gap-1.5"
							>
								<RefreshCw className="size-3.5" /> Submit another response
							</Button>
							<Button asChild variant="outline" className="w-full bg-pastel-yellow hover:bg-yellow-100 text-[#2d2638] font-bold h-11 rounded-xl border-2 border-foreground shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs flex items-center justify-center gap-1.5">
								<Link href="/"><Home className="size-3.5" /> Go back to Home</Link>
							</Button>
						</div>
					</div>
				) : (
					<div className="bg-white border-4 border-foreground rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#000] space-y-6 relative">
						
						{/* Banner header badge */}
						<div className="flex items-center justify-between">
							<span className="inline-block bg-[#7b61ff] text-white border-2 border-foreground text-[9px] font-black uppercase tracking-wider rounded-full px-3 py-1 shadow-[2.5px_2.5px_0px_#000] rotate-[-2deg]">
								Public Response Form
							</span>
						</div>

						{/* Form Info Section */}
						<div className="space-y-2 border-b-2 border-dashed border-slate-200 pb-5">
							<h1 className="text-3xl md:text-4xl font-caveat font-extrabold text-slate-800 tracking-tight leading-none">
								{form.title}
							</h1>
							{form.description && (
								<p className="text-base text-slate-600 font-patrick-hand leading-relaxed">
									{form.description}
								</p>
							)}
						</div>

						{/* Dynamic Google/Gmail Switch Box (Similar to Google Forms) */}
						<div className="bg-slate-50 border-2 border-foreground rounded-2xl p-4 shadow-[2px_2px_0px_#000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
							<div className="space-y-0.5 min-w-0 flex-1">
								<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none mb-1">
									Google Account / Active Email
								</span>
								{user ? (
									<div className="flex items-center gap-1.5 min-w-0">
										<Mail className="size-3.5 text-primary shrink-0" />
										<span className="text-sm font-bold text-foreground truncate block font-patrick-hand leading-none mt-0.5">
											{user.email}
										</span>
									</div>
								) : (
									<div className="flex items-center gap-1.5 min-w-0">
										<User className="size-3.5 text-slate-400 shrink-0" />
										<span className="text-sm font-bold text-slate-500 truncate block font-patrick-hand leading-none mt-0.5">
											Anonymous Responder
										</span>
									</div>
								)}
							</div>
							
							{user ? (
								<Button 
									onClick={handleSwitchAccount}
									variant="outline"
									className="h-8 border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[10px] font-bold bg-pastel-yellow text-[#2d2638] rounded-xl flex items-center gap-1 shrink-0"
								>
									<LogOut className="size-3" /> Switch Gmail / Log Out
								</Button>
							) : (
								<Button 
									onClick={() => { window.location.href = `/login?redirect=/form/${formId}`; }}
									variant="outline"
									className="h-8 border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[10px] font-bold bg-pastel-pink text-[#2d2638] rounded-xl flex items-center gap-1 shrink-0"
								>
									<Mail className="size-3" /> Sign In to Switch
								</Button>
							)}
						</div>

						{/* Form Elements fields list */}
						<form onSubmit={handleSubmit} className="space-y-6 pt-2">
							{submitError && (
								<div className="rounded-xl border-2 border-foreground bg-rose-50 p-4 text-xs font-bold text-rose-600 flex items-center gap-2 shadow-[2px_2px_0px_#000]">
									<AlertCircle className="size-4 shrink-0" />
									<span>{submitError}</span>
								</div>
							)}

							<div className="space-y-5">
								{form.fields.map((f: any) => {
									if (!isFieldVisible(f, form.fields, values)) {
										return null;
									}
									const fieldConfig = (() => {
										try {
											return f.configuration ? JSON.parse(f.configuration) : {};
										} catch {
											return {};
										}
									})();
									return (
										<div key={f.id} className="space-y-1.5">
											<Label htmlFor={f.id} className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-patrick-hand">
												{f.label} {f.isRequired ? <span className="text-rose-500 font-bold">*</span> : ''}
											</Label>
											{f.description && (
												<p className="text-[11px] text-slate-500 font-patrick-hand leading-none mb-1">{f.description}</p>
											)}
											{renderInput(f)}
											{errors[f.id] && (
												<p className="text-[10px] font-bold text-rose-600 mt-1 font-patrick-hand flex items-center gap-1">
													<AlertCircle className="size-3 shrink-0" />
													{errors[f.id]}
												</p>
											)}
										</div>
									);
								})}
							</div>

							{/* Actions: Submit & Refresh */}
							<div className="flex items-center gap-3 pt-4 border-t-2 border-dashed border-slate-100">
								<Button 
									type="submit" 
									disabled={isPending} 
									className="bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-11 px-6 rounded-xl border-2 border-foreground shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs flex items-center gap-1.5"
								>
									{isPending ? 'Delivering...' : 'Submit Response'} <Send className="size-3.5" />
								</Button>
								<Button 
									variant="outline" 
									type="button" 
									onClick={() => refetch?.()} 
									className="bg-pastel-yellow hover:bg-yellow-100 text-[#2d2638] font-bold h-11 border-2 border-foreground rounded-xl text-xs shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all flex items-center gap-1.5"
								>
									Refresh Form <RefreshCw className="size-3.5" />
								</Button>
							</div>
						</form>
					</div>
				)}
			</div>

			{activeTermsContent && (
				<div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-[#fbfaf5] border-4 border-foreground rounded-3xl p-6 max-w-lg w-full shadow-[8px_8px_0px_#000] relative animate-in zoom-in-95 duration-150 flex flex-col">
						<button 
							type="button"
							onClick={() => setActiveTermsContent(null)}
							className="absolute top-4 right-4 border-2 border-foreground rounded-lg p-1 bg-white hover:bg-slate-50 transition-all shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
						>
							<X className="size-4" />
						</button>
						<h3 className="font-caveat text-3xl font-extrabold text-[#2d2638] border-b-2 border-dashed border-[#2d2638]/20 pb-2 mb-4">
							{activeTermsTitle || 'Terms & Conditions'}
						</h3>
						<div className="max-h-[50vh] overflow-y-auto pr-1 text-sm font-patrick-hand text-slate-700 whitespace-pre-wrap leading-relaxed">
							{activeTermsContent}
						</div>
						<div className="mt-5 pt-3 border-t border-dashed border-[#2d2638]/10 flex justify-end">
							<Button 
								type="button"
								onClick={() => setActiveTermsContent(null)}
								className="border-2 border-foreground shadow-[2.5px_2.5px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs font-bold bg-[#7b61ff] text-white rounded-xl h-9 px-4 cursor-pointer"
							>
								I Agree & Understand
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

async function uploadFile(file: File): Promise<string> {
	const formData = new FormData();
	formData.append('file', file);
	
	const res = await fetch('/api/upload', {
		method: 'POST',
		body: formData,
	});
	
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || 'Upload failed');
	}
	
	const data = await res.json();
	return data.url;
}

function PdfUploadInput({
	fieldId,
	value,
	onChange,
	required,
	placeholder,
	disabled = false,
}: {
	fieldId: string;
	value?: string;
	onChange: (url: string) => void;
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
}) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.type !== 'application/pdf') {
			setError('Please select a valid PDF file.');
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const url = await uploadFile(file);
			onChange(url);
		} catch (err: any) {
			setError(err.message || 'Failed to upload PDF.');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-2">
			{value ? (
				<div className="flex items-center justify-between border-2 border-foreground rounded-2xl p-4 bg-white shadow-[2px_2px_0px_#000] gap-3">
					<div className="flex items-center gap-2 min-w-0">
						<FileText className="size-8 text-[#7b61ff] shrink-0" />
						<div className="min-w-0">
							<p className="text-xs font-bold text-slate-700 truncate font-patrick-hand">
								{value.split('/').pop()}
							</p>
							<a
								href={value}
								target="_blank"
								rel="noreferrer"
								className="text-[10px] font-bold text-[#7b61ff] hover:underline font-patrick-hand"
							>
								View Document
							</a>
						</div>
					</div>
					{!disabled && (
						<Button
							type="button"
							onClick={() => onChange('')}
							className="h-8 px-3 border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[10px] font-bold bg-pastel-pink text-[#2d2638] rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
						>
							<Trash2 className="size-3" /> Clear
						</Button>
					)}
				</div>
			) : (
				<label className={`border-2 border-dashed border-foreground rounded-2xl p-6 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 relative min-h-[110px] ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}>
					<input
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						className="hidden"
						disabled={uploading || disabled}
					/>
					{uploading ? (
						<div className="flex flex-col items-center gap-2">
							<Loader2 className="size-6 animate-spin text-[#7b61ff]" />
							<span className="text-[11px] font-bold font-patrick-hand text-slate-500">Uploading PDF...</span>
						</div>
					) : (
						<div className="flex flex-col items-center gap-1.5 text-center">
							<Upload className="size-6 text-slate-400" />
							<span className="text-xs font-bold font-patrick-hand text-slate-600">
								{placeholder || 'Click to upload PDF document'}
							</span>
							<span className="text-[10px] font-bold font-patrick-hand text-slate-400 uppercase">
								PDF only
							</span>
						</div>
					)}
				</label>
			)}
			{error && (
				<p className="text-[10px] font-bold text-rose-500 font-patrick-hand">{error}</p>
			)}
		</div>
	);
}

function ImageUploadInput({
	fieldId,
	value,
	onChange,
	required,
	placeholder,
	disabled = false,
}: {
	fieldId: string;
	value?: string;
	onChange: (url: string) => void;
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
}) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			setError('Please select a valid image file.');
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const url = await uploadFile(file);
			onChange(url);
		} catch (err: any) {
			setError(err.message || 'Failed to upload image.');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-2">
			{value ? (
				<div className="flex items-center gap-4">
					{/* Polaroid Preview */}
					<div className="relative border-2 border-foreground rounded-2xl p-2 bg-white shadow-[3px_3px_0px_#000] rotate-[-2deg] max-w-[140px] flex flex-col items-center shrink-0">
						<div className="size-24 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 relative">
							<img
								src={value}
								alt="Preview"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="pt-2 pb-1 text-[9px] font-bold font-patrick-hand text-slate-500 truncate w-full text-center">
							Polaroid preview
						</div>
						{!disabled && (
							<button
								type="button"
								onClick={() => onChange('')}
								className="absolute -top-2 -right-2 bg-pastel-pink border-2 border-foreground rounded-full size-7 flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer text-[#2d2638]"
								aria-label="Remove image"
							>
								<X className="size-3.5" />
							</button>
						)}
					</div>
					<div className="min-w-0">
						<p className="text-[10px] font-bold text-slate-400 font-patrick-hand uppercase">Uploaded image</p>
						<p className="text-xs font-bold text-slate-700 truncate font-patrick-hand">{value.split('/').pop()}</p>
					</div>
				</div>
			) : (
				<label className={`border-2 border-dashed border-foreground rounded-2xl p-6 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 relative min-h-[110px] ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						disabled={uploading || disabled}
					/>
					{uploading ? (
						<div className="flex flex-col items-center gap-2">
							<Loader2 className="size-6 animate-spin text-[#7b61ff]" />
							<span className="text-[11px] font-bold font-patrick-hand text-slate-500">Uploading Image...</span>
						</div>
					) : (
						<div className="flex flex-col items-center gap-1.5 text-center">
							<Upload className="size-6 text-slate-400" />
							<span className="text-xs font-bold font-patrick-hand text-slate-600">
								{placeholder || 'Click to upload image'}
							</span>
							<span className="text-[10px] font-bold font-patrick-hand text-slate-400 uppercase">
								Images only
							</span>
						</div>
					)}
				</label>
			)}
			{error && (
				<p className="text-[10px] font-bold text-rose-500 font-patrick-hand">{error}</p>
			)}
		</div>
	);
}

function MultipleImagesUploadInput({
	fieldId,
	value,
	onChange,
	required,
	placeholder,
	disabled = false,
}: {
	fieldId: string;
	value?: string;
	onChange: (urlsString: string) => void;
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
}) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Parse existing urls
	const urls = useMemo(() => {
		return value ? value.split(',').filter(Boolean) : [];
	}, [value]);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			setError('Please select a valid image file.');
			return;
		}

		if (urls.length >= 4) {
			setError('You can upload up to 4 images only.');
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const url = await uploadFile(file);
			const newUrls = [...urls, url];
			onChange(newUrls.join(','));
		} catch (err: any) {
			setError(err.message || 'Failed to upload image.');
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = (indexToRemove: number) => {
		const newUrls = urls.filter((_, idx) => idx !== indexToRemove);
		onChange(newUrls.join(','));
	};

	return (
		<div className="space-y-3">
			{urls.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{urls.map((url, idx) => (
						<div
							key={idx}
							className="relative border-2 border-foreground rounded-2xl p-2 bg-white shadow-[3px_3px_0px_#000] rotate-[-1.5deg] flex flex-col items-center"
						>
							<div className="size-20 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 relative w-full">
								<img
									src={url}
									alt={`Preview ${idx + 1}`}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="pt-2 text-[8px] font-bold font-patrick-hand text-slate-500 truncate w-full text-center">
								Image {idx + 1}
							</div>
							{!disabled && (
								<button
									type="button"
									onClick={() => handleRemove(idx)}
									className="absolute -top-1.5 -right-1.5 bg-pastel-pink border-2 border-foreground rounded-full size-6 flex items-center justify-center shadow-[1px_1px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer text-[#2d2638]"
									aria-label="Remove image"
								>
									<X className="size-3" />
								</button>
							)}
						</div>
					))}
				</div>
			)}

			{urls.length < 4 && (
				<label className={`border-2 border-dashed border-foreground rounded-2xl p-5 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 relative min-h-[90px] ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						disabled={uploading || disabled}
					/>
					{uploading ? (
						<div className="flex flex-col items-center gap-2">
							<Loader2 className="size-5 animate-spin text-[#7b61ff]" />
							<span className="text-[10px] font-bold font-patrick-hand text-slate-500">Uploading Image {urls.length + 1}...</span>
						</div>
					) : (
						<div className="flex flex-col items-center gap-1.5 text-center">
							<Upload className="size-5 text-slate-400" />
							<span className="text-xs font-bold font-patrick-hand text-slate-600">
								{placeholder || `Add image (${urls.length}/4)`}
							</span>
							<span className="text-[9px] font-bold font-patrick-hand text-slate-400 uppercase">
								Up to 4 images
							</span>
						</div>
					)}
				</label>
			)}
			{error && (
				<p className="text-[10px] font-bold text-rose-500 font-patrick-hand">{error}</p>
			)}
		</div>
	);
}

function StarRatingInput({
	value,
	onChange,
	maxStars = 5,
	disabled = false,
}: {
	value?: string;
	onChange: (rating: string) => void;
	maxStars?: number;
	disabled?: boolean;
}) {
	const currentRating = Number(value || '0');
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

	return (
		<div className="flex items-center gap-1.5 py-1">
			{stars.map((star) => {
				const isFilled = hoverRating !== null ? star <= hoverRating : star <= currentRating;
				return (
					<button
						key={star}
						type="button"
						disabled={disabled}
						onClick={() => onChange(String(star))}
						onMouseEnter={() => !disabled && setHoverRating(star)}
						onMouseLeave={() => !disabled && setHoverRating(null)}
						className="focus:outline-none transition-transform hover:scale-125 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
						aria-label={`Rate ${star} star`}
					>
						<svg
							viewBox="0 0 24 24"
							className={`size-8 stroke-2 stroke-[#2d2638] ${
								isFilled ? 'fill-pastel-yellow' : 'fill-white'
							} ${disabled ? 'opacity-70' : ''}`}
						>
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
						</svg>
					</button>
				);
			})}
			{currentRating > 0 && (
				<span className="text-xs font-bold text-slate-500 font-patrick-hand ml-2">
					{currentRating} out of {maxStars}
				</span>
			)}
		</div>
	);
}

function SignaturePadInput({
	fieldId,
	value,
	onChange,
	height = 120,
	disabled = false,
}: {
	fieldId: string;
	value?: string;
	onChange: (url: string) => void;
	height?: number;
	disabled?: boolean;
}) {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.strokeStyle = '#2d2638';
		ctx.lineWidth = 3;
		ctx.lineCap = 'round';
	}, [value, height]);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (disabled) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		setIsDrawing(true);
		ctx.beginPath();
		
		const rect = canvas.getBoundingClientRect();
		const touch = 'touches' in e ? e.touches[0] : null;
		const x = (touch ? touch.clientX : (e as React.MouseEvent).clientX) - rect.left;
		const y = (touch ? touch.clientY : (e as React.MouseEvent).clientY) - rect.top;
		ctx.moveTo(x, y);
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing || disabled) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const touch = 'touches' in e ? e.touches[0] : null;
		const x = (touch ? touch.clientX : (e as React.MouseEvent).clientX) - rect.left;
		const y = (touch ? touch.clientY : (e as React.MouseEvent).clientY) - rect.top;
		ctx.lineTo(x, y);
		ctx.stroke();

		if ('touches' in e) {
			e.preventDefault();
		}
	};

	const stopDrawing = () => {
		setIsDrawing(false);
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		onChange('');
	};

	const saveSignature = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		setUploading(true);
		setError(null);

		try {
			const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
			if (!blob) throw new Error('Failed to capture signature');

			const file = new File([blob], `signature_${fieldId}.png`, { type: 'image/png' });
			const url = await uploadFile(file);
			onChange(url);
		} catch (err: any) {
			setError(err.message || 'Failed to upload signature.');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-2">
			{value ? (
				<div className="flex flex-col sm:flex-row items-center justify-between border-2 border-foreground rounded-2xl p-4 bg-white shadow-[2px_2px_0px_#000] gap-3">
					<div className="flex items-center gap-3 w-full sm:w-auto">
						<div className="border-2 border-foreground rounded-xl bg-slate-50 p-1 w-24 h-12 flex items-center justify-center overflow-hidden">
							<img src={value} alt="Signature Preview" className="h-full object-contain" />
						</div>
						<span className="text-xs font-bold text-slate-700 font-patrick-hand">Signature saved</span>
					</div>
					{!disabled && (
						<Button
							type="button"
							onClick={clearCanvas}
							className="h-8 px-3 border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[10px] font-bold bg-pastel-pink text-[#2d2638] rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
						>
							<Trash2 className="size-3" /> Clear & Redraw
						</Button>
					)}
				</div>
			) : (
				<div className="space-y-3">
					<div className="border-2 border-foreground rounded-2xl bg-white p-2 shadow-[2px_2px_0px_#000] inline-block w-full max-w-[320px]">
						<canvas
							ref={canvasRef}
							width={300}
							height={height}
							className={`bg-white border border-dashed border-slate-300 rounded-xl touch-none w-full ${disabled ? 'cursor-not-allowed bg-slate-50' : 'cursor-crosshair'}`}
							onMouseDown={startDrawing}
							onMouseMove={draw}
							onMouseUp={stopDrawing}
							onMouseLeave={stopDrawing}
							onTouchStart={startDrawing}
							onTouchMove={draw}
							onTouchEnd={stopDrawing}
						/>
					</div>
					{!disabled && (
						<div className="flex gap-2">
							<Button
								type="button"
								onClick={saveSignature}
								disabled={uploading}
								className="h-8 px-3 border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[10px] font-bold bg-pastel-green text-[#2d2638] rounded-xl flex items-center gap-1 cursor-pointer"
							>
								{uploading ? <Loader2 className="size-3 animate-spin" /> : 'Confirm Signature'}
							</Button>
							<Button
								type="button"
								onClick={clearCanvas}
								className="h-8 px-3 border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[10px] font-bold bg-white text-[#2d2638] rounded-xl flex items-center gap-1 cursor-pointer"
							>
								Clear
							</Button>
						</div>
					)}
					{error && <p className="text-[10px] font-bold text-rose-500 font-patrick-hand">{error}</p>}
				</div>
			)}
		</div>
	);
}

function AddressInput({
	value,
	onChange,
	shownFields = { street: true, city: true, state: true, country: true, zip: true },
	disabled = false,
}: {
	value?: string;
	onChange: (address: string) => void;
	shownFields?: { street?: boolean; city?: boolean; state?: boolean; country?: boolean; zip?: boolean };
	disabled?: boolean;
}) {
	const parseAddress = (val: string) => {
		try {
			const data = JSON.parse(val);
			return {
				street: data.street || '',
				city: data.city || '',
				state: data.state || '',
				zip: data.zip || '',
				country: data.country || '',
			};
		} catch {
			return { street: '', city: '', state: '', zip: '', country: '' };
		}
	};

	const fields = useMemo(() => parseAddress(value || ''), [value]);

	const updateField = (key: string, val: string) => {
		const updated = { ...fields, [key]: val };
		onChange(JSON.stringify(updated));
	};

	return (
		<div className="border-2 border-foreground rounded-2xl p-4 bg-white shadow-[2px_2px_0px_#000] space-y-3 max-w-md">
			{shownFields.street !== false && (
				<div className="space-y-1">
					<label className="text-[10px] font-bold text-slate-400 uppercase font-patrick-hand">Street Address</label>
					<Input
						type="text"
						value={fields.street}
						onChange={(e) => updateField('street', e.target.value)}
						placeholder="123 Main St"
						disabled={disabled}
						className="w-full bg-white border-2 border-foreground rounded-xl h-10 px-3 text-xs font-bold shadow-[1px_1px_0px_#000] focus:shadow-none focus:translate-x-[0.5px] focus:translate-y-[0.5px] outline-none transition-all font-patrick-hand placeholder-slate-400"
					/>
				</div>
			)}
			<div className="grid grid-cols-2 gap-2">
				{shownFields.city !== false && (
					<div className="space-y-1">
						<label className="text-[10px] font-bold text-slate-400 uppercase font-patrick-hand">City</label>
						<Input
							type="text"
							value={fields.city}
							onChange={(e) => updateField('city', e.target.value)}
							placeholder="City"
							disabled={disabled}
							className="w-full bg-white border-2 border-foreground rounded-xl h-10 px-3 text-xs font-bold shadow-[1px_1px_0px_#000] focus:shadow-none focus:translate-x-[0.5px] focus:translate-y-[0.5px] outline-none transition-all font-patrick-hand placeholder-slate-400"
						/>
					</div>
				)}
				{shownFields.state !== false && (
					<div className="space-y-1">
						<label className="text-[10px] font-bold text-slate-400 uppercase font-patrick-hand">State</label>
						<Input
							type="text"
							value={fields.state}
							onChange={(e) => updateField('state', e.target.value)}
							placeholder="State"
							disabled={disabled}
							className="w-full bg-white border-2 border-foreground rounded-xl h-10 px-3 text-xs font-bold shadow-[1px_1px_0px_#000] focus:shadow-none focus:translate-x-[0.5px] focus:translate-y-[0.5px] outline-none transition-all font-patrick-hand placeholder-slate-400"
						/>
					</div>
				)}
				{shownFields.zip !== false && (
					<div className="space-y-1">
						<label className="text-[10px] font-bold text-slate-400 uppercase font-patrick-hand">ZIP Code</label>
						<Input
							type="text"
							value={fields.zip}
							onChange={(e) => updateField('zip', e.target.value)}
							placeholder="Zip"
							disabled={disabled}
							className="w-full bg-white border-2 border-foreground rounded-xl h-10 px-3 text-xs font-bold shadow-[1px_1px_0px_#000] focus:shadow-none focus:translate-x-[0.5px] focus:translate-y-[0.5px] outline-none transition-all font-patrick-hand placeholder-slate-400"
						/>
					</div>
				)}
				{shownFields.country !== false && (
					<div className="space-y-1">
						<label className="text-[10px] font-bold text-slate-400 uppercase font-patrick-hand">Country</label>
						<Input
							type="text"
							value={fields.country}
							onChange={(e) => updateField('country', e.target.value)}
							placeholder="Country"
							disabled={disabled}
							className="w-full bg-white border-2 border-foreground rounded-xl h-10 px-3 text-xs font-bold shadow-[1px_1px_0px_#000] focus:shadow-none focus:translate-x-[0.5px] focus:translate-y-[0.5px] outline-none transition-all font-patrick-hand placeholder-slate-400"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
