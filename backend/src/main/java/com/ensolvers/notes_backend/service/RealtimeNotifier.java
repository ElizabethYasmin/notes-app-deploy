package com.ensolvers.notes_backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RealtimeNotifier {

    private final SimpMessagingTemplate messagingTemplate;

    public RealtimeNotifier(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Notifies every active session of the given user that their notes/categories
     * changed, so other open tabs/devices can refresh without polling.
     */
    public void notifyUser(String username) {
        messagingTemplate.convertAndSendToUser(username, "/queue/updates", "changed");
    }
}
