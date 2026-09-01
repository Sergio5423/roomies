package com.unicesar.roomies.model.entity.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String emailInstitucional;
    private String password;
}