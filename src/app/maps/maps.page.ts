import { Component } from '@angular/core';
import * as L from 'leaflet';

import { DataService } from '../data.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage {

  map!: L.Map;

  constructor(
    private dataService: DataService
  ) {}

  ionViewDidEnter() {

    setTimeout(() => {

      // Membuat peta
      this.map = L.map('map').setView(
        [-7.7956, 110.3695],
        13
      );

      // OpenStreetMap
      const osm = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; OpenStreetMap contributors'
        }
      );

      osm.addTo(this.map);

      // Memuat point Firebase
      this.loadPoints();

      // Memperbaiki ukuran peta
      setTimeout(() => {

        this.map.invalidateSize();

      }, 300);

    }, 300);
  }

  async loadPoints() {

    try {

      const points: any =
        await this.dataService.getPoints();

      console.log(
        'Data points:',
        points
      );

      // Jika tidak ada data
      if (!points) {
        console.log(
          'Belum ada point di Firebase'
        );
        return;
      }

      // Perulangan point
      for (const key in points) {

        if (
          Object.prototype.hasOwnProperty.call(
            points,
            key
          )
        ) {

          const point =
            points[key];

          console.log(
            'Point:',
            point
          );

          // Mengubah koordinat
          const coordinates =
            point.coordinates
              .split(',')
              .map(
                (c: string) =>
                  parseFloat(
                    c.trim()
                  )
              );

          console.log(
            'Coordinates:',
            coordinates
          );

          // Marker
          const marker =
            L.marker(
              coordinates as L.LatLngExpression
            ).addTo(this.map);

          // Popup
          marker.bindPopup(
            `<b>${point.name}</b><br>${point.description}`
          );
        }
      }

    } catch (error) {

      console.error(
        'Gagal memuat points:',
        error
      );
    }
  }

  ionViewWillLeave() {

    if (this.map) {

      this.map.remove();

      this.map =
        undefined as any;
    }
  }
}