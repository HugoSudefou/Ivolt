import {apiService} from 'boot/iv-api';
import {DiscordTokenDtos, GuildMemberDiscodDtos} from "src/common/dtos/discord.dtos";
import {WorkDone} from "src/common/utils";
import {displayNotification} from "src/services/common/notification.service";
import {NotificationStatusEnum} from "src/common/enums";
import {MessageEnum} from "src/common/enums/message.enum";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URL;
const DISCORD_IVOLT_ID = process.env.DISCORD_IVOLT_ID;
const ROLE_IVOLT_ID = process.env.ROLE_IVOLT_ID;
const SCOPES = ['identify', 'guilds', 'guilds.members.read'];

export function getAuthorizationUrl(): string {
  return `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(
    '%20',
  )}`;
}

export async function exchangeCodeForToken(code: string): Promise<WorkDone<DiscordTokenDtos | undefined>> {
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
  };

  const successMessage = 'token get with succes';
  const warningMessage = null;

  const urlParameters = Object.entries(data)
    .map((e) => e.join('='))
    .join('&');

  return await apiService.doPost<DiscordTokenDtos>(
    'https://discord.com/api/v9/oauth2/token',
    urlParameters,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    },
    {successMessage, warningMessage}
  );
}

export async function getUserGuilds(accessToken: string) {

  const successMessage = 'guild get with succes';
  const warningMessage = null;

  return await apiService.doGet<GuildMemberDiscodDtos>(
    `https://discord.com/api/v9/users/@me/guilds/${DISCORD_IVOLT_ID}/member`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    {successMessage, warningMessage}
  );
}

export function isUserHasRoleIVolt(guildMe: GuildMemberDiscodDtos) {
  const isRoleIVolt = guildMe.roles.find(
    (role) => role === process.env.ROLE_IVOLT_ID,
  );
  displayNotification(!!isRoleIVolt ? NotificationStatusEnum.SUCCESS : NotificationStatusEnum.FAILURE, !!isRoleIVolt ? MessageEnum.IS_OK_IS_USER_HAS_ROLE_IVOLT : MessageEnum.IS_NOK_IS_USER_HAS_ROLE_IVOLT)
  return !!isRoleIVolt;
}
