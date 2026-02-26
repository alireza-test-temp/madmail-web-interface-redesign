export interface MadMailConfig {
  mailDomain: string;
  webDomain: string;
  registrationOpen: boolean;
  jitEnabled: boolean;
  publicIP: string;
  turnOffTLS: boolean;
  ssURL: string;
  version: string;
  defaultQuota: string;
  retentionDays: number;
}
// In a real MadMail Go setup, these values would be injected into the window object
// by the server-side template engine. Here we simulate that for the SPA.
export const madConfig: MadMailConfig = {
  mailDomain: "madmail.example.com",
  webDomain: "madmail.example.com",
  registrationOpen: true,
  jitEnabled: true,
  publicIP: "1.2.3.4",
  turnOffTLS: false,
  ssURL: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo2YjMxM2I0YS02Zjc0LTQ5ZTMtOTBjMi03OTU2ZmYyZTgzM2VAMS4yLjMuNDo4NDQz#MadMailProxy",
  version: "v1.4.2",
  defaultQuota: "104857600", // 100 MB in bytes for numeric formatting
  retentionDays: 20, // Updated from 30 to 20 per client request
};