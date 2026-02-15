export const registerFormControls = [
    {
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        componentType: 'input',
        type: 'text'
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password'
    }
]

export const verifyEmailFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email'
    },
    {
        name: 'verification_code',
        label: 'Verification Code',
        placeholder: 'Enter the verification code',
        componentType: 'input',
        type: 'text'
    }
];

export const loginFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password'
    }
];


export const PoepleViewHeaderMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/people/dashboard",
  },
  {
    id: "people",
    label: "People",
    path: "/people/list",
  },
  {
    id: "addperson",
    label: "Add Person",
    path: "/people/add",
  },
  {
    id: "groups&tags",
    label: "Groups & Tags",
    path: "/people/groups",
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/people/analytics",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/poeple/settings",
  },
];

export const addPeopleFormElements = [
  {
    label: "Full Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter full name",
    required: true
  },
  {
    label: "Email",
    name: "email",
    componentType: "input",
    type: "email",
    placeholder: "Enter email address"
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "tel",
    placeholder: "Enter phone number"
  },
  {
    label: "Company",
    name: "company",
    componentType: "input",
    type: "text",
    placeholder: "Enter company name"
  },
  {
    label: "Role",
    name: "role",
    componentType: "input",
    type: "text",
    placeholder: "Enter job role"
  },
  {
    label: "Department",
    name: "department",
    componentType: "input",
    type: "text",
    placeholder: "Enter department"
  },
  {
    label: "Street Address",
    name: "street",
    componentType: "input",
    type: "text",
    placeholder: "Enter street address"
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter city"
  },
  {
    label: "State",
    name: "state",
    componentType: "input",
    type: "text",
    placeholder: "Enter state"
  },
  {
    label: "ZIP Code",
    name: "zip",
    componentType: "input",
    type: "text",
    placeholder: "Enter ZIP code"
  },
  {
    label: "Country",
    name: "country",
    componentType: "input",
    type: "text",
    placeholder: "Enter country"
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter notes about this person",
    required: true
  }
];