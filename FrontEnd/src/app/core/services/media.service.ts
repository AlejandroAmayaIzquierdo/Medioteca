import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MediaType } from '../models/Media/MediaTypes';
import { catchError, tap, throwError } from 'rxjs';
import { CreateMediaDto, Media, MediaQueryDto } from '../models/Media/Media';
import { PagedList } from '../models/PagedList';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly apiUrl = `${environment.apiUrl}/Media`;

  private isLoading = signal(false);
  public readonly loading = this.isLoading.asReadonly();

  private mediaSearchResults = signal<Media[]>([]);
  private mediaTypes = signal<MediaType[]>([]);

  public readonly mediaTypes$ = this.mediaTypes.asReadonly();
  public readonly mediaSearchResults$ = this.mediaSearchResults.asReadonly();

  constructor(private http: HttpClient) {
    this.fetchMediaTypes().subscribe();
    this.fetchMedia({}).subscribe();
  }

  public fetchMediaTypes() {
    this.isLoading.set(true);
    return this.http.get<PagedList<MediaType>>(`${this.apiUrl}/types`).pipe(
      tap((data) => {
        this.isLoading.set(false);
        this.mediaTypes.set(data.items);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }

  public fetchMedia(query: MediaQueryDto) {
    this.isLoading.set(true);

    return this.http
      .get<
        PagedList<Media>
      >(`${this.apiUrl}`, { params: new HttpParams().set('searchTerm', query.searchTerm || '') })
      .pipe(
        tap((data) => {
          console.log('Fetched media data:', data);
          this.isLoading.set(false);
          this.mediaSearchResults.set(data.items);
        }),
        catchError((error) => {
          this.isLoading.set(false);
          return throwError(() => error);
        }),
      );
  }

  public fetchMediaById(mediaId: string) {
    this.isLoading.set(true);
    return this.http.get<Media>(`${this.apiUrl}/${mediaId}`).pipe(
      tap((data) => {
        this.isLoading.set(false);
        console.log('Fetched media data by ID:', data);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }

  public createMedia(mediaData: CreateMediaDto) {
    this.isLoading.set(true);

    return this.http.post<Media>(`${this.apiUrl}`, mediaData).pipe(
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }
}
