import sys

file_path = 'd:/ChaiCode/monorepo1/trpc-monorepo/apps/web/app/dashboard/page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    # Templates section
    "Assistant's Feeding Log": 'Employee Feedback',
    "Track food intake and walk times for our favorite white puppy.": 'Collect anonymous feedback and suggestions from your team.',
    'label: "Feeder Name"': 'label: "Department"',
    'labelKey: "feeder_name"': 'labelKey: "department"',
    'description: "Who fed Assistant?"': 'description: "Which department are you in?"',
    'label: "Kibble Portions (cups)"': 'label: "Satisfaction (1-10)"',
    'labelKey: "kibble_portions"': 'labelKey: "satisfaction_score"',
    'description: "Amount of cups given"': 'description: "Rate your overall satisfaction"',
    'label: "Did Assistant get a walk?"': 'label: "Recommend to a friend?"',
    'labelKey: "shiro_walk"': 'labelKey: "recommend"',
    'description: "Took Assistant around the platform?"': 'description: "Would you recommend our workplace?"',
    'Action Shin': 'John Doe',
    'Misae Nohara': 'The system',
    'Nohara Household': 'our database',
    'Hero Name': 'Full Name',
    'labelKey: "hero_name"': 'labelKey: "full_name"',
    'description: "Your superhero nickname"': 'description: "Your full legal name"',
    'Punch Power Level': 'Age',
    'labelKey: "punch_power"': 'labelKey: "age"',
    'description: "Scale of 1-100"': 'description: "Your current age"',
    'Patrol Member': 'Reported By',
    'labelKey: "patrol_member"': 'labelKey: "reported_by"',
    'Kazama-kun': 'Jane Smith',
    'description: "Name of the reporting member"': 'description: "Your name"',
    
    # UI Texts
    "ROOM: KID'S ROOM": 'ROOM: MY FORMS',
    "User's Playground 🧸": 'My Workspace 📁',
    'My Form Recipes': 'My Forms',
    "Here's all form blueprints scattered across User's playground toy chest.": 'Manage and organize all your forms in one central workspace.',
    'Create Form Recipe 🍳': 'Create New Form 📝',
    'Start your new form by naming it. Then configure fields in the Dining Room.': 'Start your new form by giving it a name. Then add fields in the Form Builder.',
    'Start Cooking': 'Create Form',
    'Cooking...': 'Creating...',
    'Rummaging through toy box...': 'Loading your forms...',
    'Toy box is clean! No forms inside. Create a brand new form recipe to get started!': 'Your workspace is empty! Create a new form to get started.',
    'Form Recipe Builder': 'Form Builder',
    'Cook your form fields, ingredients, and settings. Select a recipe from the stove below.': 'Configure your form fields and settings. Select a form from the menu below to begin.',
    'Selected Recipe': 'Selected Form',
    'Pick a form to cook...': 'Select a form to edit...',
    'Choose recipe...': 'Choose form...',
    'No Stove Selected': 'No Form Selected',
    'Empty Stover': 'No Form Selected',
    "Select a recipe from the dropdown menu above to start editing questions, or head to the Kid's Room to create one from scratch.": 'Select a form from the dropdown menu above to start editing fields, or head to My Forms to create one from scratch.',
    'Form Blueprints': 'Form Templates',
    'Use pre-designed blueprints designed by the Workspace family to publish instant web forms.': 'Use our professionally designed templates to instantly generate web forms.',
    'Suburban Mailbox yard 📭': 'Responses Inbox 📥',
    'Letters & Submissions': 'Submissions',
    'View response entries submitted by fans and neighbors around the globe.': 'View, manage, and analyze response entries from your users.',
    'Opening letters... Please wait. 📬': 'Loading submissions... Please wait.',
    'Mailbox is Empty': 'No Submissions Yet',
    'No letters found inside this drawer. Open your form public links to start gathering letters from neighbors.': 'No submissions found for this form. Share your public link to start collecting responses.',
    "Assistant's Backyard Yard 🐕": 'Analytics Dashboard 📊',
    'Garden Analytics': 'Analytics',
    'Observe how your form response rates bloom inside the Workspace family garden.': 'Monitor form performance, submission rates, and analyze user data.',
    'Trophy Cabinet 🏆': 'User Settings ⚙️',
    'Shinchan': 'User',
    'Himawari (Baby sister)': 'Project Manager',
    'Hiroshi (Daddy)': 'Administrator',
    'Misae (Mommy)': 'Editor',
    'Shiro (Dog)': 'Guest',
    'Action Kamen': 'CEO',
    'Action Mask': 'Super Admin',
    'Buri Buri Zaemon': 'Developer',
    'Favorite Character': 'Your Role',
    'Pick your spirit character from the Kasukabe defense group!': 'Select your primary role in the organization.',
    'User Status': 'Bio',
    '"Heh! Get started by creating a new form. Hurry up and build forms so the admin doesn\'t catch us idling!"': '"Welcome to your workspace! Create dynamic forms and collect data seamlessly."',
    'Form Recipe Created': 'Form Created',
    'Recipe Title': 'Form Title',
    'Fetching tatami recipes...': 'Loading recent forms...',
    'No form recipes cooked yet. Go build your first blueprint!': 'No forms created yet. Go build your first form!',
    'Misae Nohara has stored your response inside the drawer. Thank you for your support!': 'Your response has been securely saved. Thank you for your submission!'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Replacements finished')
