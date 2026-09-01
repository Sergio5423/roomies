package com.unicesar.roomies.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inquilinos")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inquilino extends Usuario {

    @OneToOne(mappedBy = "inquilino", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Preferencia preferencia;

    @ManyToMany
    @JoinTable(
        name = "inquilino_favoritos",
        joinColumns = @JoinColumn(name = "inquilino_id"),
        inverseJoinColumns = @JoinColumn(name = "alojamiento_id")
    )
    private List<Alojamiento> favoritos = new ArrayList<>();

    @OneToMany(mappedBy = "inquilino", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PublicacionRoomie> publicacionesRoomie = new ArrayList<>();

    @OneToMany(mappedBy = "inquilino", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Solicitud> solicitudes = new ArrayList<>();

    @OneToMany(mappedBy = "inquilino", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reserva> reservas = new ArrayList<>();

    @OneToMany(mappedBy = "inquilino", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resena> resenasEscritas = new ArrayList<>();
}