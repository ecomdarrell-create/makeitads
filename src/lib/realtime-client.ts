// ✅ Realtime temporairement désactivé pour stabiliser le dashboard
// On pourra le réactiver plus tard quand les problèmes de connexion seront résolus

export class RealtimeManager {
  private channels: Map<string, any> = new Map();
  private retryCount: Map<string, number> = new Map();

  getChannel(channelName: string) {
    // Retourne un channel factice
    return {
      on: () => ({ on: () => ({ subscribe: () => {} }) }),
      subscribe: () => {},
      unsubscribe: () => {},
    };
  }

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channelName = `notifications-${userId}`;
    console.log(`ℹ️ Realtime désactivé pour: ${channelName}`);
    return {
      unsubscribe: () => {
        this.channels.delete(channelName);
      },
    };
  }

  subscribeToCompetitors(userId: string, callback: (payload: any) => void) {
    const channelName = `competitors-${userId}`;
    console.log(`ℹ️ Realtime désactivé pour: ${channelName}`);
    return {
      unsubscribe: () => {
        this.channels.delete(channelName);
      },
    };
  }

  unsubscribe(channel: any) {
    if (channel?.unsubscribe) {
      channel.unsubscribe();
    }
  }
}

let realtimeInstance: RealtimeManager | null = null;

export function getRealtimeClient(): RealtimeManager {
  if (!realtimeInstance) {
    realtimeInstance = new RealtimeManager();
  }
  return realtimeInstance;
}