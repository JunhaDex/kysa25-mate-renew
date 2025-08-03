export interface Mention {
  ref: string
  nickname: string
}

export interface UserProfile extends Mention {
  id: number
  profileImg: string
  coverImg: string
  introduce: string
  teamId: number
}

export interface Friend extends UserProfile {
  name: string
  sex: number //iso 5218
  age: number
  dob: string
  geo: string
  actStatus: number
  team: Team
}

export interface Team {
  teamId: number
  teamName: string
}
