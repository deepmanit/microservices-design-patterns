package com.microservice.jwt.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.validation.constraints.NotNull;

/**
 * Configuration class.
 */
@Data
@ConfigurationProperties(prefix = "configuration")
public class Java8SpringConfigurationProperties {
    /**
     * Jwt configuration
     */
    @NotNull
    private Jwt jwt;

    @Data
    public static class Jwt {

        /**
         * This token must be encoded using Base64 (you can type `echo 'secret-key'|base64` on your command line)
         */
        private String base64Secret;

        /**
         * Expiry token in seconds.
         */
        private long tokenValidityInSeconds;

        /**
         * Remember me expiry token in seconds.
         */
        private long tokenValidityInSecondsForRememberMe;

        private String keystore;

        private String keystoreAlias;

        private String keystorePassword;
    }
}
