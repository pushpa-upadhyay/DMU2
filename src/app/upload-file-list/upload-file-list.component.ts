import { from } from 'rxjs';
import { File } from './file';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FileUploadService } from '../services/file-upload.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as fileSaver from 'file-saver';


@Component({
  selector: 'app-upload-file-list',
  templateUrl: './upload-file-list.component.html',
  styleUrls: ['./upload-file-list.component.css']
})

export class UploadFileListComponent implements OnInit, AfterViewInit {
  //columnsToDisplay = ['fileName', 'uploadedDate', 'fileType', 'fileSize', 'fileAction'];
  columnsToDisplay = ['fileName', 'size', 'modified', 'fileAction'];
  fileList: File[] = [];
  filelistdataSource: any;
  //filelistdataSource = new MatTableDataSource(filelist);
  fromSelected: string;
  toSelected: string;
  pipe: DatePipe;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fileService: FileUploadService) {
  }

  ngAfterViewInit(): void {
    this.filelistdataSource.paginator = this.paginator;
    this.filelistdataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAllFileDetails();
  }

  //Search Filter
  applyFilter(filterValue: string) {
    // console.log('filterValue'+filterValue);
    // console.log(this.filelistdataSource);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.filelistdataSource.filter = filterValue;
  }

  //Date Range Filter
  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }

  filterByDateRange() {
    this.pipe = new DatePipe('en');
    this.filelistdataSource.filterPredicate = (data, filter) => {
      if (this.fromDate && this.toDate) {
        return data.uploadedDate >= this.fromDate && data.uploadedDate <= this.toDate;
      }
      return true;
    }
    this.filelistdataSource.filter = '' + Math.random();
  }

  //Clear Filters
  clearFilter() {
    this.filelistdataSource.filter = '';
    this.fromSelected = '';
    this.toSelected = '';
  }

  deleteFile(item: any) {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.fileService.deleteFile(item.fileDeleteUri).subscribe(
        data => {
          console.log("In Delete File Component!!");
          console.log(data);
          this.getAllFileDetails();
        },
        err => { }
      );
    } else {
      console.log("EVENT CANCELLED!!");
    }

  }

  downloadFile(item: any) {
    this.fileService.downloadFile(item.fileDownloadUri).subscribe(response => {
      let blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, item.fileName);
    }), error => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }

  getAllFileDetails() {
    this.fileService.getUploadedFilesDeatils().subscribe(
      data => {
        this.fileList = data;
        console.log(this.fileList);
        this.filelistdataSource = new MatTableDataSource(this.fileList);
        this.filelistdataSource.paginator = this.paginator;
        this.filelistdataSource.sort = this.sort;
      },
      err => {
        alert("Problem in getting file data!!");
      }
    );
  }
}
