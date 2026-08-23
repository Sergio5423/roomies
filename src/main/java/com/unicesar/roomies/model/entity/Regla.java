package com.unicesar.roomies.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reglas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Regla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Boolean obligatoria;
}