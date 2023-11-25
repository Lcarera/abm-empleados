import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { ColumnData } from '@/interfaces/column-data.interfaces';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatGridListModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T> implements OnInit {
  private _data: T[] = [];

  @Input()
  set data(data: T[]) {
    this._data = data;
    this.dataSource = new MatTableDataSource(this._data);
  }
  get data(): T[] {
    return this._data;
  }

  @Input()
  columns!: ColumnData[];

  @Output() 
  rowClicked: EventEmitter<T> = new EventEmitter<T>();

  dataSource!: MatTableDataSource<T>;
  displayedColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;


  constructor() {}
  
  ngOnInit() {
    this.displayedColumns = this.columns.map((c) => c.matColumnDef);
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: T) {
    this.rowClicked.emit(row);
  }
}
