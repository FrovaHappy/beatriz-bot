export interface Root {
  general: General
  setWelcome: SetWelcome
}

export interface General {
  withoutPermission: string
}

export interface SetWelcome {
  title: string
  description: string
}
