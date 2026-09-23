package com.ensolvers.notes_backend.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public StompAuthChannelInterceptor(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String[] credentials = extractBasicCredentials(accessor.getFirstNativeHeader("Authorization"));
            if (credentials == null) {
                throw new org.springframework.security.access.AccessDeniedException("Missing Authorization header on STOMP CONNECT");
            }

            UserDetails userDetails;
            try {
                userDetails = userDetailsService.loadUserByUsername(credentials[0]);
            } catch (UsernameNotFoundException ex) {
                throw new org.springframework.security.access.AccessDeniedException("Invalid credentials");
            }

            if (!passwordEncoder.matches(credentials[1], userDetails.getPassword())) {
                throw new org.springframework.security.access.AccessDeniedException("Invalid credentials");
            }

            var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            accessor.setUser(authentication);
        }

        return message;
    }

    private String[] extractBasicCredentials(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Basic ")) {
            return null;
        }
        String base64Credentials = authorizationHeader.substring("Basic ".length());
        String decoded = new String(Base64.getDecoder().decode(base64Credentials), StandardCharsets.UTF_8);
        String[] parts = decoded.split(":", 2);
        return parts.length == 2 ? parts : null;
    }
}
