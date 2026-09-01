package com.unicesar.roomies.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "preferencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "presupuesto_minimo", precision = 12, scale = 2)
    private BigDecimal presupuestoMinimo;

    @Column(name = "presupuesto_maximo", precision = 12, scale = 2)
    private BigDecimal presupuestoMaximo;

    @Column(name = "distancia_max_minutos")
    private Integer distanciaMaxMinutos;

    @Column(name = "numero_habitaciones_deseadas")
    private Integer numeroHabitacionesDeseadas;

    @ElementCollection
    @CollectionTable(name = "preferencia_servicios_deseados", joinColumns = @JoinColumn(name = "preferencia_id"))
    @Column(name = "servicio")
    private List<String> serviciosDeseados = new ArrayList<>();

    @Column(name = "solo_con_roomie_disponible")
    private Boolean soloConRoomieDisponible;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alojamiento")
    private TipoAlojamiento tipoAlojamiento;

    private Boolean amoblado;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquilino_id", nullable = false, unique = true)
    private Inquilino inquilino;
}