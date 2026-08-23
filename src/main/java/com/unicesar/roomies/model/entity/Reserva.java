package com.unicesar.roomies.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio_confirmada", nullable = false)
    private LocalDate fechaInicioConfirmada;

    @Column(name = "fecha_fin_confirmada", nullable = false)
    private LocalDate fechaFinConfirmada;

    @Column(name = "precio_acordado", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioAcordado;

    @Column(name = "fecha_reserva", nullable = false, updatable = false)
    private LocalDateTime fechaReserva;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitud_id", nullable = false, unique = true)
    private Solicitud solicitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alojamiento_id", nullable = false)
    private Alojamiento alojamiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquilino_id", nullable = false)
    private Inquilino inquilino;

    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Resena resena;

    @PrePersist
    protected void onCreate() {
        this.fechaReserva = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoReserva.CONFIRMADA;
        }
    }

    public void confirmarReserva() {
        this.estado = EstadoReserva.CONFIRMADA;
    }

    public void cancelarReserva() {
        this.estado = EstadoReserva.CANCELADA;
    }

    public BigDecimal calcularTotal() {
        if (fechaInicioConfirmada == null || fechaFinConfirmada == null || precioAcordado == null) {
            return BigDecimal.ZERO;
        }
        long meses = ChronoUnit.MONTHS.between(fechaInicioConfirmada, fechaFinConfirmada);
        if (meses <= 0) {
            meses = 1; // Mínimo cobro de 1 mes
        }
        return precioAcordado.multiply(BigDecimal.valueOf(meses));
    }
}