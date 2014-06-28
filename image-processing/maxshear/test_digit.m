

mato=imread('digit4-blue-pink-sm.png');
mat=double(mato);
[r,c]=size(mat);


min_shift=-1;
max_shift=1;
step=0.001;
shift_range=min_shift:step:max_shift;


%% Look for optimal horizontal shear

result=[];
index=0;
for shift=shift_range;
 index=index+1;
 vect=zeros(1,c+length(shift_range));

 for i=1:r;
  for j=1:c;
   ind=length(shift_range)/2+j+(i-1)*shift;
   ratio=ind-floor(ind);
   vect(ceil(ind))=vect(ceil(ind))+ratio*mat(i,j);
   vect(floor(ind))=vect(floor(ind))+(1.0-ratio)*mat(i,j);
  end
 end

 result(index)=var(vect);
end

[max_val,pos_max]=max(result);
horiz_shear=(r-1)*(min_shift+(pos_max-1)*step)
figure(1)
plot(result)


%% Look for optimal vertical shear

result=[];
index=0;
for shift=shift_range;
 index=index+1;
 vect=zeros(1,r+length(shift_range));

 for j=1:c;
  for i=1:r;
   ind=length(shift_range)/2+i+(j-1)*shift;
   ratio=ind-floor(ind);
   vect(ceil(ind))=vect(ceil(ind))+ratio*mat(i,j);
   vect(floor(ind))=vect(floor(ind))+(1.0-ratio)*mat(i,j);
  end
 end

 result(index)=var(vect);
end

[max_val,pos_max]=max(result);
vertical_shear=(c-1)*(min_shift+(pos_max-1)*step)
figure(2)
plot(result)


%% Look for vertical lines.. (using optimal horizontal shear value)


%% Look for horizontal lines.. (using optimal vertical shear value)



%% Look for intersection of lines 


