import { Context } from '@nuxt/types';
import { canPlayNativeHls } from '~/utils/transcodingFormats';

export default async (context: Context): Promise<void> => {
  if (
    context.store.state.user.id &&
    context.store.state.user.serverUrl &&
    context.store.state.user.accessToken
  ) {
    context.$axios.setBaseURL(context.store.state.user.serverUrl);

    const accessToken = `MediaBrowser Client="${context.store.state.deviceProfile.clientName}", Device="${context.store.state.deviceProfile.deviceName}", DeviceId="${context.store.state.deviceProfile.deviceId}", Version="${context.store.state.deviceProfile.clientVersion}", Token="${context.store.state.user.accessToken}"`;
    context.$auth.setUserToken(accessToken);

    console.warn(accessToken);

    const response = await context.$userApi.getUserById({
      userId: context.store.state.user.id
    });

    context.$auth.setUser(response.data);
  }
};
